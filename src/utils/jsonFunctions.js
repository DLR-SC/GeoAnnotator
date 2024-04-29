/**
 * Checks, if the file is of type 'application/json'
 * @param {FileList} files 
 * @returns {boolean}
 */
export function checkFileType(files) {
    for(let file of files) if(file.type !== "application/json") throw new Error("File is not of type \"JSON\"")

    return true;
}

/**
 * Convert a File into a JSONArray
 * @param {File} file
 * @param {React.Dispatch<React.SetStateAction>} setFileData
 * @returns {JSONArray} Array of JSON-Objects with following attributes: source, location and text
 */
export function convertFileToJSONArray(file, setFileData) {
    const reader = new FileReader();

    reader.onload = (e) => setFileData(JSON.parse(e.target.result));
    reader.readAsText(file);
}

/**
 * Structure the locations attribute of currentData, and turn it into a JSONArray with following attributes:
 * - placename: Location
 * - position: Coordinates of Location
 * 
 * @param {{ location: [float, float] }} locations 
 * @returns 
 */
export function structureLocationAttribute(locations) {
    return locations ? Object.entries(locations).map(([placename, [lat, long]]) => ({
        position: [lat, long],
        name: placename,
    })) : undefined;
}