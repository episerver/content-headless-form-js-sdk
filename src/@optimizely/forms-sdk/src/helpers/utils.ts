/**
 * Function to check if a string value is null, undefined, or empty
 * @param value A string value to check
 * @returns True or false
 */
export function isNullOrEmpty(value: string): boolean{
    return isNull(value) || value === "";
}

/**
 * Function to check if an object value is null or undefined
 * @param value An object value to check
 * @returns True or false
 */
export function isNull(value: any): boolean{
    return value === null || value === undefined;
}

/**
 * Function to check if two strings are equal
 * @param value1 The first string value
 * @param value2 The second string value
 * @param ignoreCase Whether ignore case sensitive. Default false.
 * @returns True or false
 */
export function equals(value1: string, value2: string, ignoreCase: boolean = false): boolean{
    if(ignoreCase){
        return value1.toLowerCase() === value2.toLowerCase();
    }
    else {
        return value1 === value2;
    }
}