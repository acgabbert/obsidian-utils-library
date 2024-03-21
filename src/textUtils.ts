import { TFile } from "obsidian";
export { defangIp, defangDomain, friendlyDatetime, lowerSha256, lowerMd5, todayLocalDate, todayFolderStructure }

function todayLocalDate(): string {
    /**
     * @returns current local date as a string in format YYYY-MM-DD
     */
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
    return date;
}

function todayFolderStructure(quarter: boolean): Array<string> {
    /**
     * Returns a string with the folder structure for the current date
     * Format: `YYYY/YYYY-QQ/YYYY-MM/YYYY-MM-DD`
     * 
     * @param quarter - Boolean specifying whether to include quarter (YYYY-QQ) in the folder structure
     * @returns the folder structure for the current date
     */
    const date = todayLocalDate();
    const year = date.slice(0,4);
    const month = Number(date.slice(5,7));
    const yearMonth = date.slice(0,7);
    const currentQuarter = Math.floor((month + 2) / 3);
    const folderArray = [year, yearMonth, date]
    if (quarter) {
        folderArray.splice(1, 0, `${year}-Q${currentQuarter}`)
    }
    const folders = folderArray.join('/');
    return folderArray;
}

function defangIp(text: string): string {
    /**
     * Defangs IP addresses, e.g. `8.8.8.8` becomes `8.8.8[.]8`
     * @returns input string with IP addresses defanged
     */
    return text.replaceAll(/(\d{1,3}\.\d{1,3}\.\d{1,3})\.(\d{1,3})/g, "$1[.]$2");
}

function defangDomain(text: string): string {
    /**
     * Defangs domains preceded with http(s), e.g. `https://google.com` 
     * becomes `hxxps[://]google[.]com`
     * @returns input string with domains defanged
     */
    return text.replaceAll(/http(s?):\/\/([^\/]*)\.([^\/\.]+\/?.*)/g, "hxxp$1[://]$2[.]$3");
}

function lowerSha256(text: string): string {
    /**
     * Converts SHA256 hashes (or any 64 character alphanumeric string) to lowercase
     * @returns input string with SHA256 hashes converted to lowercase
     */
    return text.replace(/(\w{64})/g, function(match) {
        return match.toLowerCase();
    });
}

function lowerMd5(text: string): string {
    /**
     * Converts MD5 hashes (or any 32 character alphanumeric string) to lowercase
     * @returns input string with MD5 hashes converted to lowercase
     */
    return text.replace(/(\w{32})/g, function(match) {
        return match.toLowerCase();
    });
}

function friendlyDatetime(text: string): string {
    /**
     * Converts a datetime string in the format `YYYY-MM-DD HH:MM:SS UTC`
     * to the following: `YYYY-MM-DD at HH:MM:SS UTC`
     * @returns input string with datetimes converted to "{date} at {time}"
     */
    return text.replace(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\s+UTC)/g, "$1 at $2");
}

function replaceTemplateText(template: string, clipboard: string, note: TFile) {
    
}