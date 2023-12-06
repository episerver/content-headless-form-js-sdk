import { isInArray } from "./utils";

/**
 * Function to get extension from file name
 * @param fileName A string of file name
 * @returns A string of extension
 */
export function getFileExtension(fileName: string): string {
    /// <summary>get file extension WITHOUT DOT</summary>

    // returning "" instead of the full string when there's no dot or no string before the dot
    return fileName.substring((~-fileName.lastIndexOf(".") >>> 0) + 2); // replace "+ 2" with "+ 1" to include the DOT
}

/**
 * Function to check if extension of file valid
 * @param fileName A string of file name
 * @param acceptTypes An array of extension
 * @returns True or false
 */
export function isFileValid(fileName: string, acceptTypes: string[]): boolean{
    /// <summary>checking file name with list of extension WITHOUT DOT</summary>

    var fileExtension = getFileExtension(fileName);
    // file without extension is considered as invalid
    if (fileExtension.length < 1) {
        return false;
    }

    // just check when extension was specified
    if (acceptTypes.length < 1) {
        return true;
    }

    return isInArray(fileExtension, acceptTypes, true);
}