# Auto Note Mover (Forked)

Auto Note Mover will automatically move the active notes to their respective folders according to the rules.

## About this fork

This is a fork of the popular Auto Note Mover plugin by faru, which has not been updated in several years. This fork brings the plugin up to date with current versions of Obsidian.

Changes in this fork:

- Fixed the folder and tag suggestion dropdown appearing outside the settings window when Obsidian settings are opened in a pop-out window.

### Migrating from the original plugin

> [!warning]
> Never enable the original **Auto Note Mover** and **Auto Note Mover (Forked)** at the same time. Both plugins watch the same notes, so they can move a note twice or move it to the wrong folder. Disable the original before you enable the fork.

Your rules and other settings are stored in `data.json`, and this fork reads the same format. To bring them over:

1. In Obsidian, go to **Settings > Community plugins** and disable **Auto Note Mover** (the original). Disabling it first stops both plugins from moving notes at the same time.
2. Install and enable **Auto Note Mover (Forked)**.
3. Close Obsidian, or disable **Auto Note Mover (Forked)**, so it does not overwrite the file.
4. Copy `data.json` from the original plugin folder to the fork's folder:
   - From: `<vault>\.obsidian\plugins\auto-note-mover\data.json`
   - To: `<vault>\.obsidian\plugins\auto-note-mover-forked\data.json`
5. Start Obsidian again (or re-enable the fork) and check **Settings > Auto Note Mover (Forked)** to confirm your rules are listed.
6. Once the rules look right, you can remove the original plugin.

If the fork's folder already has a `data.json`, replace it with the copied file.

This fork is currently **desktop only**. It has not been tested on mobile.

All credit for the original plugin goes to its author. This fork keeps the original MIT license.

## How it works

Register the tag or title of the note you want to move to the rule.

When the active note matches the rule, Auto Note Mover will move the note to the destination folder.

If you create a new note from a link in an existing note or from another plugin, Auto Note Mover will move those notes to the folder you want, so you don't have to worry about where or how to create the note.

If the rule is matched but the destination folder is not found, or if the destination folder has a note with the same name, a warning will be displayed and the move will be aborted.

## Triggers

There are two types of triggers for Auto Note Mover.

### Automatic

Triggered when you create, edit, or rename a note, and moves the note if it matches the rules.

You can also activate the trigger with a command.

### Manual

Will not automatically move notes.

You can trigger by command.

## Rules

1. Set the destination folder.
2. Set a tag or title that matches the note you want to move. **You can set either the tag or the title.**
3. The rules are checked in order from the top. The notes will be moved to the folder with the **first matching rule.**

Tag: Be sure to add a **\#** at the beginning.

Title: Tested by JavaScript regular expressions.

## Notice

1. Attached files will not be moved, but they will still appear in the note.
2. Auto Note Mover will not move notes that have "**AutoNoteMover: disable**" in the frontmatter.

## Example of use

### Tag
![Food0](https://user-images.githubusercontent.com/33874906/152721614-45a65095-3af2-4e80-8973-26be686ca585.png)

![Food2](https://user-images.githubusercontent.com/33874906/152721697-7cf722fc-bc82-4c5d-8bbe-6c087755d29c.png)

### Nested Tag
![nest0](https://user-images.githubusercontent.com/33874906/152721876-58b19020-eb75-4324-a8ba-2110dba11ea6.png)

![nest1](https://user-images.githubusercontent.com/33874906/152721897-be270fc9-6381-46b6-99d0-1d5a08260a06.png)

### Daily Notes
![day0](https://user-images.githubusercontent.com/33874906/152721914-48ed5cc5-ec08-4f80-9425-8c68b719107a.png)

![day1](https://user-images.githubusercontent.com/33874906/152721927-659d0ad4-ce9f-4aea-8752-8eb668500af5.png)

### Task Notes
![task0](https://user-images.githubusercontent.com/33874906/152723161-6a8d9999-15e9-4e97-8b71-e07ff30fb330.png)

![task1](https://user-images.githubusercontent.com/33874906/152723175-839e724c-4437-42ff-ba05-f458e45c3f21.png)

### Star Notes
![sta0](https://user-images.githubusercontent.com/33874906/152721996-74f29153-4266-4aff-88e6-e765ef031d65.png)

![sta1](https://user-images.githubusercontent.com/33874906/152722006-54f5c315-8d5b-457b-8cfc-ec982a2b088c.png)

### How to Notes
![how0](https://user-images.githubusercontent.com/33874906/152722040-e100961b-8398-485d-bc64-f3fa784b79be.png)

![how1](https://user-images.githubusercontent.com/33874906/152722054-820441a1-a244-43cb-b8f2-fcde06310d40.png)

### Command
![comm](https://user-images.githubusercontent.com/33874906/152723205-70599951-75ee-4915-a160-17a3faed67b0.png)

### Disable Auto Note Mover in front matter.
![fm0](https://user-images.githubusercontent.com/33874906/152722074-d550e13c-2955-40ab-b324-7e934d86ea1a.png)


## Troubleshooting

### 1. Notes do not move.

Make sure that the rules are correct, that no excluded folders are set, and that they are not disabled in the frontmatter.
Another possibility is that if the vault is monitored by a real-time sync software like Dropbox, if the editing overlaps with the timing of the sync, the sync software might lock the note and prevent it from being moved.

### 2. Duplicate notes
Check your sync software.

Duplicate notes due to iCloud glitches have been reported (see issue #19 on the original plugin's repository).

## Attribution
Original Auto Note Mover was created by faru. This repository is a fork of that project.
file-suggest.ts and tag-suggest.ts are copyrighted works of Liam Cain (https://github.com/liamcain) obsidian-periodic-notes (https://github.com/liamcain/obsidian-periodic-notes).

This fork is maintained by Rafael Ordaz (https://github.com/rordaz).
