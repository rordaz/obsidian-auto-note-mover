import { AbstractInputSuggest, App } from 'obsidian';

// Fires `input` after picking a suggestion so the setting's onChange saves the value.
export abstract class TextInputSuggest<T> extends AbstractInputSuggest<T> {
	private readonly targetInputEl: HTMLInputElement;

	constructor(app: App, inputEl: HTMLInputElement) {
		super(app, inputEl);
		this.targetInputEl = inputEl;
	}

	selectSuggestion(item: T): void {
		this.setValue(this.toInputValue(item));
		this.targetInputEl.dispatchEvent(new Event('input'));
		this.close();
	}

	protected abstract toInputValue(item: T): string;
}
