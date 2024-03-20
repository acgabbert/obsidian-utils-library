import { Vault } from 'obsidian';

export { checkFolderExistsRecursive, createFolderIfNotExists, createNote };

async function checkFolderExistsRecursive(vault: Vault, folderName: string): Promise<string> {
    async function searchFolder(rootPath: string): Promise<string> {
        const checkVal = rootPath + "/" + folderName;
        const folderExists = await vault.adapter.exists(checkVal, true);
        if (folderExists) return folderName;
        const subFolders = (await vault.adapter.list(rootPath)).folders;
        // skip .obsidian config folder
        const i = subFolders.indexOf('.obsidian');
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

async function createFolderIfNotExists(vault: Vault, folderName: string) {
    const folder = await checkFolderExistsRecursive(vault, folderName);
    if (!folder) {
        await vault.createFolder(folderName);
    }
}

async function createNote(vault: Vault, folderName: string, noteTitle: string) {
    await vault.create(`${folderName}/${noteTitle}`, '');
}