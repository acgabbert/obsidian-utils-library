import { TFile } from "obsidian";
export { defangIp, defangDomain, findFirstByRegex, friendlyDatetime, lowerSha256, lowerMd5, replaceTemplateText, todayLocalDate, todayFolderStructure }

function todayLocalDate(): string {
    /**
     * @returns current local date as a string in format YYYY-MM-DD
     */
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
    return date;
}

function localDateTime() {
    /**
     * @returns the local date/time in format `YYYY-MM-DD HH:SS`
     */
    return `${todayLocalDate()} ${new Date(Date.now()).toString().slice(16, 21)}`
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
    const httpString = /http(s?):\/\//g;
    const anyDomain = /(([a-z0-9][a-z0-9-_]{0,61}[a-z0-9]{0,1}\.?)+)+\.((xn--)?([a-z0-9\-]{2,61}|[a-z0-9-]{2,30}\.[a-z]{2,}))/g;
    let retval = text.replaceAll(httpString, "hxxp$1[://]");
    retval = retval.replaceAll(anyDomain, "$1[.]$3");
    return retval;
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

function findFirstByRegex(text: string, regex: RegExp): string {
    /**
     * Find the first match of a regex in the given string.
     * @param text the text to search
     * @param regex the regular expression to match
     * @returns first match of a regex in the given string
     */
    const result = regex.exec(text);
    if (!result) {
        throw Error;
    } else {
        return result[1]
    }
}

function replaceTemplateText(template: string, content: string, note: TFile, contentMacro: string = "{{content}}") {
    /**
     * Put a template around the given content.
     * Supported macros: 
     * - {{title}} the note title
     * - {{date}} the date in format YYYY-MM-DD
     * - {{time}} the time in format HH:SS
     * - {{content}} the content you want to replace'
     * @param template the template
     * @param content the content
     * @param note the note to which it will be inserted
     * @param contentMacro the string to replace content with @default "{{content}}"
     */
    var template_replaced = template.replaceAll("{{title}}", note.name.slice(0, -3));
    const dateTime = localDateTime().split(" ");
    template_replaced = template_replaced.replaceAll("{{date}}", dateTime[0]);
    template_replaced = template_replaced.replaceAll("{{time}}", dateTime[1]);
    template_replaced = template_replaced.replaceAll(contentMacro, content);
    return template_replaced;
}