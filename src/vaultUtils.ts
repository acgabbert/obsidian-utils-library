import { App, TFile, Vault } from 'obsidian';

export { checkFolderExistsRecursive, createFolderIfNotExists, createNote, getUnresolvedBacklinks, removeDotObsidian };

async function checkFolderExistsRecursive(vault: Vault, folderName: string): Promise<string> {
    /**
     * Check if a given folder exists
     * @param rootPath the folder to start searching from
     * @returns folder name, blank if not exists
     */
    async function searchFolder(rootPath: string): Promise<string> {
        const checkVal = rootPath + "/" + folderName;
        const folderExists = await vault.adapter.exists(checkVal, true);
        if (folderExists) return folderName;
        const subFolders = (await vault.adapter.list(rootPath)).folders;
        // skip .obsidian config folder
        const i = subFolders.indexOf('.obsidian');
        //i > -1 ? subFolders.splice(i, 1) : {};
        if (i > -1) {
            subFolders.splice(i, 1);
        }
        for (const subFolder of subFolders) {
            const isSubFolder = await vault.adapter.exists(subFolder, true);
            if (isSubFolder) {
                const found = await searchFolder(subFolder);
                if (found && !found.startsWith(subFolder)) {
                    return `${subFolder}/${found}`;
                } 
                else if (found) return found;
            }
        }

        return "";
    }

    return await searchFolder("");
}

function removeDotObsidian(folders: Array<string>) {
    // skip .obsidian config folder
    const i = folders.indexOf('.obsidian');
    if (i > -1) {
        folders.splice(i, 1);
    }
    return folders;
}

async function createFolderIfNotExists(vault: Vault, folderName: string) {
    /**
     * Creates a folder if it does not already exist.
     * @param vault
     */
    const folder = await checkFolderExistsRecursive(vault, folderName);
    if (!folder) {
        await vault.createFolder(folderName);
    }
}

async function createNote(vault: Vault, folderName: string, noteTitle: string): Promise<TFile> {
    /**
     * Creates a note within the given vault.
     * @param vault
     * @param folderName
     * @param noteTitle
     * @returns the note
     */
    return await vault.create(`${folderName}/${noteTitle}.md`, '');
}

function getUnresolvedBacklinks(notePath: string, app: App): Array<string> {
    /**
     * Get an array of the unresolved backlinks in a note.
     * @param notePath the note to check
     * @param app the current App class instance
     * @returns an array of strings
     */
    console.log(app.metadataCache.unresolvedLinks);
    const backlinks = app.metadataCache.unresolvedLinks[notePath];
    let retval = []
    for (const i in backlinks) {
        retval.push(i);
    }
    return retval;
}