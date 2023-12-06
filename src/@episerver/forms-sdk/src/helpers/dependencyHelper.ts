export function getConcatString(srcObject: any, seperator: string): string {
    return (srcObject instanceof Array) ? srcObject.join(seperator) : srcObject as string;
}