/**
 * Functions to process json-related objects
 */

/**
 * Checks, if the file is of type 'application/json'
 * 
 * @param {FileList} files 
 * @returns {boolean}
 */
export function checkFileType(files) {
    for(let file of files) if(file.type !== "application/json") throw new Error("File is not of type \"JSON\"")

    return true;
}

/**
 * Convert a File into a JSONArray
 * 
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
 * Structure the locations attribute of currentData, and turn it into a JSONArray, each object with following attributes:
 * - placename: Location
 * - position: Coordinates of Location
 * 
 * @param {{ location: [float, float] }} locations 
 */
export function structureLocationAttribute(locations) {
    return locations ? Object.entries(locations).map(([placename, [lat, long]]) => ({
        position: [lat, long],
        name: placename,
    })) : undefined;
}

/**
 * Restructure the location attribute and turn it into a JSONObject with following attributes:
 * - location: Placename of coordinate
 *      - position: Coordinates (lat, long)
 * 
 * @param {{ name: string, position: [float, float] }[]} geolocations 
 */
export function restructureLocationAttribute(geolocations) { 
    return Object.fromEntries(geolocations.map(geolocation => [geolocation.name, geolocation.position]));
}