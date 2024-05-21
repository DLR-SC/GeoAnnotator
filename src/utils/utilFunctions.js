/**
 * Pipe function, to use various operation on an Array one after another
 * @param  {...any} functions
 * @returns {Array}
 */
export function pipe(...functions) {
    return function(value) {
      return functions.reduce((currentValue, currentFunction) => {
        return currentFunction(currentValue);
      }, value);
    };
  }

/**
 * Add file to array without duplication
 * @param {Object} sessionData 
 * @param {number} newFileKey 
 * @returns {Array}
 */
export function addFileWithoutDupe(sessionData, newFileKey) {
  // Create a new Set to automatically handle duplicate removal and convert it back to an array
  const filesArray = sessionData.changedFiles ?? [], updatedFiles = new Set([...filesArray, newFileKey]), uniqueUpdatedFiles = Array.from(updatedFiles);

  return uniqueUpdatedFiles;
}
