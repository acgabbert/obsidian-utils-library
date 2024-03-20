import { TFile } from "obsidian";
export { defangIp, defangDomain, lowerSha256, lowerMd5, todayLocalDate, todayFolderStructure }

function todayLocalDate() {
    const tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    const date = (new Date(Date.now() - tzoffset)).toISOString().slice(0, 10);
    return date;
}

function todayFolderStructure() {
    const date = todayLocalDate();
    const year = date.slice(0,4);
    const month = Number(date.slice(5,7));
    const yearMonth = date.slice(0,7);
    const quarter = Math.floor((month + 2) / 3);
    const folderArray = [year, `${year}-Q${quarter}`, yearMonth, date]
    const folders = folderArray.join('/');
    return folderArray;
}

function defangIp(text: string) {
    return text.replaceAll(/(\d{1,3}\.\d{1,3}\.\d{1,3})\.(\d{1,3}))/g, "$1[.]$2");
}

function defangDomain(text: string) {
    return text.replaceAll(/http(s?):\/\/([^\/]*)\.([\/\.]+\/?.*)/g, "hxxp$1[://]$2[.]$3");
}

function lowerSha256(text: string) {
    return text.replace(/(\w{64})/g, function(match) {
        return match.toLowerCase();
    });
}

function lowerMd5(text: string) {
    return text.replace(/(\w{32})/g, function(match) {
        return match.toLowerCase();
    });
}

function friendlyDatetime(text: string) {
    return text.replace(/(\d{4}-\d{2}-\d{2})\s+(\d{2}:\d{2}:\d{2}\s+UTC)/g, "$1 at $2");
}

function replaceTemplateText(template: string, clipboard: string, note: TFile) {
    
}