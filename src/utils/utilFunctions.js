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
  