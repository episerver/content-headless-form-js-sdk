/**
 * Function to check if a string value is null, undefined, or empty
 * @param value A string value to check
 * @returns True or false
 */
export function isNullOrEmpty(value?: string): boolean{
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

/**
 * Function to check if string is matched with regex pattern
 * @param value A string to check
 * @param pattern A regex pattern
 * @returns True or false
 */
export function isMatchedReg(value: string, pattern: string): boolean{
    try {
        var rx = new RegExp(pattern), // default settings: global = false, multiline = false (causes ^ and $ to match begin and end of string), ignoreCase = false
            matches = rx.exec(value);
        return (matches != null && matches.length > 0);
    } catch (e: any) {
        console.debug(e.message);
        return false;
    }
}

/**
 * Function to check if a value is a numeric
 * @param value A value to check
 * @returns True or false
 */
export function isNumeric (value: any): boolean {
    return !isNaN(parseFloat(value)) && isFinite(value);
};

/**
 * Function to check if an array of string contains a value
 * @param value A string of value
 * @param arrayString A array of string
 * @param ignoreCase Ignore case sensitive. Default false.
 * @returns True or false
 */
export function isInArray (value: string, arrayString: string[], ignoreCase: boolean = false): boolean {
    if(ignoreCase){
        value = value.toLowerCase();
        arrayString = arrayString.map(s => s.toLowerCase());
    }
    return arrayString.indexOf(value) > -1;
}

/**
 * Decodes HTML entities in a given encoded string and returns the decoded string..
 * @param encodedString - The string containing HTML-encoded entities to be decoded.
 */
export function htmlDecodeEntities(encodedString: string) : string{
    var textArea = document.createElement("textarea");
    textArea.innerHTML = encodedString;
    return textArea.value;
}

/**
 * Parse a string key to GUID to work with OptiGraph
 * @param key 
 * @returns 
 */
export function parseKeyToGuid(key: string): string {
    if(key.includes("-")){
        return key;
    }

    var rxGetGuidGroups = /(\w{8})(\w{4})(\w{4})(\w{4})(\w{12})/,
        guidValue = key.replace(rxGetGuidGroups, '$1-$2-$3-$4-$5');
        
    return guidValue;
}