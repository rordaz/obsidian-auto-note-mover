import AutoNoteMover from 'main';
import { App, Notice, PluginSettingTab, ButtonComponent, SettingDefinitionItem, setIcon } from 'obsidian';

import { FolderSuggest } from 'suggests/file-suggest';
import { TagSuggest } from 'suggests/tag-suggest';
import { arrayMove } from 'utils/Utils';

export interface FolderTagPattern {
	folder: string;
	tag: string;
	pattern: string;
}

export interface ExcludedFolder {
	folder: string;
}

export interface AutoNoteMoverSettings {
	trigger_auto_manual: string;
	use_regex_to_check_for_tags: boolean;
	statusBar_trigger_indicator: boolean;
	folder_tag_pattern: Array<FolderTagPattern>;
	use_regex_to_check_for_excluded_folder: boolean;
	excluded_folder: Array<ExcludedFolder>;
}

export const DEFAULT_SETTINGS: AutoNoteMoverSettings = {
	trigger_auto_manual: 'Automatic',
	use_regex_to_check_for_tags: false,
	statusBar_trigger_indicator: true,
	folder_tag_pattern: [{ folder: '', tag: '', pattern: '' }],
	use_regex_to_check_for_excluded_folder: false,
	excluded_folder: [{ folder: '' }],
};

export class AutoNoteMoverSettingTab extends PluginSettingTab {
	plugin: AutoNoteMover;

	constructor(app: App, plugin: AutoNoteMover) {
		super(app, plugin);
		this.plugin = plugin;
	}

	// Re-renders the tab but keeps the settings panel's scroll position.
	private redisplayKeepingScroll(): void {
		const scroller = this.containerEl.closest('.vertical-tab-content');
		const scrollTop = scroller?.scrollTop ?? 0;
		this.update();
		if (scroller) {
			scroller.scrollTop = scrollTop;
		}
	}

	private async addRule(): Promise<void> {
		this.plugin.settings.folder_tag_pattern.push({
			folder: '',
			tag: '',
			pattern: '',
		});
		await this.plugin.saveSettings();
		this.redisplayKeepingScroll();
	}

	getSettingDefinitions(): SettingDefinitionItem[] {
		const items: SettingDefinitionItem[] = [];
		const descEl = createFragment();

		items.push({
			name: 'Auto Note Mover (Forked)',
			render: (setting) => {
				setting.setHeading();
			},
		});

		items.push({
			name: '',
			desc: 'Auto Note Mover will automatically move the active notes to their respective folders according to the rules.',
		});

		const migrationDesc = createFragment();
		migrationDesc.createEl('p', {
			text: 'Caution: never enable the original Auto Note Mover and this fork at the same time. Both would watch the same notes and could move a note twice or to the wrong folder.',
			cls: 'mod-warning',
		});
		migrationDesc.createEl('p', { text: 'To bring your rules over from the original plugin:' });
		const steps = migrationDesc.createEl('ol');
		steps.createEl('li', { text: 'Disable Auto Note Mover (the original) in Community plugins.' });
		steps.createEl('li', { text: 'Enable Auto Note Mover (Forked).' });
		steps.createEl('li', {
			text: `Close Obsidian, or disable the fork, then copy data.json from plugins/auto-note-mover/ to plugins/auto-note-mover-forked/ in your vault's ${this.app.vault.configDir} folder.`,
		});
		steps.createEl('li', { text: 'Start Obsidian again (or re-enable the fork) and check the rules below.' });
		steps.createEl('li', { text: 'Remove the original plugin once the rules look right.' });

		items.push({ name: 'Migrating from the original plugin', desc: migrationDesc });

		const triggerDesc = createFragment();
		triggerDesc.append(
			'Choose how the trigger will be activated.',
			descEl.createEl('br'),
			descEl.createEl('strong', { text: 'Automatic ' }),
			'is triggered when you create, edit, or rename a note, and moves the note if it matches the rules.',
			descEl.createEl('br'),
			'You can also activate the trigger with a command.',
			descEl.createEl('br'),
			descEl.createEl('strong', { text: 'Manual ' }),
			'will not automatically move notes.',
			descEl.createEl('br'),
			'You can trigger by command.'
		);
		items.push({
			name: 'Trigger',
			desc: triggerDesc,
			render: (setting) => {
				setting.addDropdown((dropDown) =>
					dropDown
						.addOption('Automatic', 'Automatic')
						.addOption('Manual', 'Manual')
						.setValue(this.plugin.settings.trigger_auto_manual)
						.onChange(async (value: string) => {
							this.plugin.settings.trigger_auto_manual = value;
							await this.plugin.saveData(this.plugin.settings);
							this.redisplayKeepingScroll();
						})
				);
			},
		});

		const useRegexToCheckForTags = createFragment();
		useRegexToCheckForTags.append(
			'If enabled, tags will be checked with regular expressions.',
			descEl.createEl('br'),
			'For example, if you want to match the #tag, you would write ',
			descEl.createEl('strong', { text: '^#tag$' }),
			descEl.createEl('br'),
			'This setting is for a specific purpose, such as specifying nested tags in bulk.',
			descEl.createEl('br'),
			descEl.createEl('strong', {
				text: 'If you want to use the suggested tags as they are, it is recommended to disable this setting.',
			})
		);
		items.push({
			name: 'Use regular expressions to check for tags',
			desc: useRegexToCheckForTags,
			render: (setting) => {
				setting.addToggle((toggle) => {
					toggle.setValue(this.plugin.settings.use_regex_to_check_for_tags).onChange(async (value) => {
						this.plugin.settings.use_regex_to_check_for_tags = value;
						await this.plugin.saveSettings();
						this.redisplayKeepingScroll();
					});
				});
			},
		});

		const ruleDesc = createFragment();
		ruleDesc.append(
			'1. Set the destination folder.',
			descEl.createEl('br'),
			'2. Set a tag or title that matches the note you want to move. ',
			descEl.createEl('strong', { text: 'You can set either the tag or the title. ' }),
			descEl.createEl('br'),
			'3. The rules are checked in order from the top. The notes will be moved to the folder with the ',
			descEl.createEl('strong', { text: 'first matching rule.' }),
			descEl.createEl('br'),
			'Tag: Be sure to add a',
			descEl.createEl('strong', { text: ' # ' }),
			'at the beginning.',
			descEl.createEl('br'),
			'Title: Tested by JavaScript regular expressions.',
			descEl.createEl('br'),
			descEl.createEl('br'),
			'Notice:',
			descEl.createEl('br'),
			'1. Attached files will not be moved, but they will still appear in the note.',
			descEl.createEl('br'),
			'2. Auto Note Mover will not move notes that have "',
			descEl.createEl('strong', { text: 'AutoNoteMover: disable' }),
			'" in the frontmatter.'
		);
		items.push({ name: 'Add new rule', desc: ruleDesc });

		this.plugin.settings.folder_tag_pattern.forEach((folder_tag_pattern, index) => {
			const settings = this.plugin.settings.folder_tag_pattern;
			const settingTag = settings.map((e) => e['tag']);
			const settingPattern = settings.map((e) => e['pattern']);
			const checkArr = (arr: string[], val: string) => {
				return arr.some((arrVal) => val === arrVal);
			};

			items.push({
				name: '',
				render: (s) => {
					s.addSearch((cb) => {
						new FolderSuggest(this.app, cb.inputEl);
						cb.setPlaceholder('Folder')
							.setValue(folder_tag_pattern.folder)
							.onChange(async (newFolder) => {
								this.plugin.settings.folder_tag_pattern[index].folder = newFolder.trim();
								await this.plugin.saveSettings();
							});
					})

						.addSearch((cb) => {
							new TagSuggest(this.app, cb.inputEl);
							cb.setPlaceholder('Tag')
								.setValue(folder_tag_pattern.tag)
								.onChange(async (newTag) => {
									if (this.plugin.settings.folder_tag_pattern[index].pattern) {
										this.redisplayKeepingScroll();
										return new Notice(`You can set either the tag or the title.`);
									}
									if (newTag && checkArr(settingTag, newTag)) {
										new Notice('This tag is already used.');
										return;
									}
									if (!this.plugin.settings.use_regex_to_check_for_tags) {
										this.plugin.settings.folder_tag_pattern[index].tag = newTag.trim();
									} else if (this.plugin.settings.use_regex_to_check_for_tags) {
										this.plugin.settings.folder_tag_pattern[index].tag = newTag;
									}
									await this.plugin.saveSettings();
								});
						})

						.addSearch((cb) => {
							cb.setPlaceholder('Title by regex')
								.setValue(folder_tag_pattern.pattern)
								.onChange(async (newPattern) => {
									if (this.plugin.settings.folder_tag_pattern[index].tag) {
										this.redisplayKeepingScroll();
										return new Notice(`You can set either the tag or the title.`);
									}

									if (newPattern && checkArr(settingPattern, newPattern)) {
										new Notice('This pattern is already used.');
										return;
									}

									this.plugin.settings.folder_tag_pattern[index].pattern = newPattern;
									await this.plugin.saveSettings();
								});
						})
						.addExtraButton((cb) => {
							cb.setIcon('up-chevron-glyph')
								.setTooltip('Move up')
								.onClick(async () => {
									arrayMove(this.plugin.settings.folder_tag_pattern, index, index - 1);
									await this.plugin.saveSettings();
									this.redisplayKeepingScroll();
								});
						})
						.addExtraButton((cb) => {
							cb.setIcon('down-chevron-glyph')
								.setTooltip('Move down')
								.onClick(async () => {
									arrayMove(this.plugin.settings.folder_tag_pattern, index, index + 1);
									await this.plugin.saveSettings();
									this.redisplayKeepingScroll();
								});
						})
						.addExtraButton((cb) => {
							cb.setIcon('cross')
								.setTooltip('Delete')
								.onClick(async () => {
									this.plugin.settings.folder_tag_pattern.splice(index, 1);
									await this.plugin.saveSettings();
									this.redisplayKeepingScroll();
								});
						});
					s.infoEl.remove();
				},
			});
		});

		items.push({
			name: '',
			render: (setting) => {
				setting.settingEl.addClass('anm-add-rule-setting');
				setting.infoEl.remove();
				const addRuleEl = setting.controlEl.createEl('button', { cls: 'anm-add-rule' });
				setIcon(addRuleEl, 'plus');
				addRuleEl.createSpan({ text: 'Add rule' });
				addRuleEl.addEventListener('click', () => {
					void this.addRule();
				});
			},
		});

		const useRegexToCheckForExcludedFolder = createFragment();
		useRegexToCheckForExcludedFolder.append(
			'If enabled, excluded folder will be checked with regular expressions.'
		);

		items.push({
			name: 'Use regular expressions to check for excluded folder',
			desc: useRegexToCheckForExcludedFolder,
			render: (setting) => {
				setting.addToggle((toggle) => {
					toggle.setValue(this.plugin.settings.use_regex_to_check_for_excluded_folder).onChange(async (value) => {
						this.plugin.settings.use_regex_to_check_for_excluded_folder = value;
						await this.plugin.saveSettings();
						this.redisplayKeepingScroll();
					});
				});
			},
		});

		const excludedFolderDesc = createFragment();
		excludedFolderDesc.append(
			'Notes in the excluded folder will not be moved.',
			descEl.createEl('br'),
			'This takes precedence over the notes movement rules.'
		);
		items.push({
			name: 'Add Excluded Folder',
			desc: excludedFolderDesc,
			render: (setting) => {
				setting.addButton((button: ButtonComponent) => {
					button
						.setTooltip('Add Excluded Folders')
						.setButtonText('+')
						.setCta()
						.onClick(async () => {
							this.plugin.settings.excluded_folder.push({
								folder: '',
							});
							await this.plugin.saveSettings();
							this.redisplayKeepingScroll();
						});
				});
			},
		});

		this.plugin.settings.excluded_folder.forEach((excluded_folder, index) => {
			items.push({
				name: '',
				render: (s) => {
					s.addSearch((cb) => {
						new FolderSuggest(this.app, cb.inputEl);
						cb.setPlaceholder('Folder')
							.setValue(excluded_folder.folder)
							.onChange(async (newFolder) => {
								this.plugin.settings.excluded_folder[index].folder = newFolder;
								await this.plugin.saveSettings();
							});
					})
						.addExtraButton((cb) => {
							cb.setIcon('up-chevron-glyph')
								.setTooltip('Move up')
								.onClick(async () => {
									arrayMove(this.plugin.settings.excluded_folder, index, index - 1);
									await this.plugin.saveSettings();
									this.redisplayKeepingScroll();
								});
						})
						.addExtraButton((cb) => {
							cb.setIcon('down-chevron-glyph')
								.setTooltip('Move down')
								.onClick(async () => {
									arrayMove(this.plugin.settings.excluded_folder, index, index + 1);
									await this.plugin.saveSettings();
									this.redisplayKeepingScroll();
								});
						})
						.addExtraButton((cb) => {
							cb.setIcon('cross')
								.setTooltip('Delete')
								.onClick(async () => {
									this.plugin.settings.excluded_folder.splice(index, 1);
									await this.plugin.saveSettings();
									this.redisplayKeepingScroll();
								});
						});
					s.infoEl.remove();
				},
			});
		});

		const statusBarTriggerIndicatorDesc = createFragment();
		statusBarTriggerIndicatorDesc.append(
			'The status bar will display [A] if the trigger is Automatic, and [M] for Manual.',
			descEl.createEl('br'),
			'To change the setting, you need to restart Obsidian.',
			descEl.createEl('br'),
			'Desktop only.'
		);
		items.push({
			name: 'Status Bar Trigger Indicator',
			desc: statusBarTriggerIndicatorDesc,
			render: (setting) => {
				setting.addToggle((toggle) => {
					toggle.setValue(this.plugin.settings.statusBar_trigger_indicator).onChange(async (value) => {
						this.plugin.settings.statusBar_trigger_indicator = value;
						await this.plugin.saveSettings();
						this.redisplayKeepingScroll();
					});
				});
			},
		});

		return items;
	}
}
