export function getConcatString(srcObject: any, seperator: string): string {
    let str =  (srcObject instanceof Array) ? srcObject.join(seperator) : srcObject as string;
    return str.toLocaleUpperCase();
}