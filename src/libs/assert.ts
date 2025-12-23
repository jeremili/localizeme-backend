import * as baseAssert from 'assert';
const { AssertionError } = baseAssert;

/**
 * Throws an AssertionError if any of the values for the object params is null
 * or undefined. (Only checks object own properties, not inherited).
 *
 * E.g.
 * const objOk = {foo: '', bar: 42}
 * assert.areNotNil(objOk)          // Nothing happens
 *
 * const objNotOk = {foo: null, bar: 42}
 * assert.areNotNil(objNotOk)       // Throws an AssertionError
 *
 * @param {object} parameters Object with own properties to be asserted.
 * @returns {void}
 */
function areNotNil(parameters: object): void {
  if (parameters === null || parameters === undefined) {
    throw new AssertionError({
      message: 'Something went wrong: no parameters were passed.'
    });
  }

  for (const [key, value] of Object.entries(parameters)) {
    if (value === null || value === undefined) {
      throw new AssertionError({ message: `${key} is required` });
    }
  }
}

/**
 * Throws an AssertionError if an empty array is passed
 *
 * E.g.
 * const objOk = [42]
 * assert.areNotEmpty(objOk)          // Nothing happens
 *
 * const objNotOk = []
 * assert.areNotEmpty(objNotOk)       // Throws an AssertionError
 *
 * @param {object} parameters Object with own properties to be asserted.
 * @returns {void}
 */
function areNotEmpty(parameters: object): void {
  if (parameters === null || parameters === undefined) {
    throw new AssertionError({
      message: 'Something went wrong: no parameters were passed.'
    });
  }

  // array empty
  for (const [key, value] of Object.entries(parameters)) {
    if (value === null || value === undefined || (Array.isArray(value) && value.length === 0)) {
      throw new AssertionError({ message: `${key} cannot be empty` });
    }
  }
}

/**
 * This is node's standard library assert function, here for convenience.
 *
 * Throws an AssertionError if value is falsy.
 *
 * E.g.
 * assert(true)       // Nothing happens
 * assert('Denmark')  // Nothing happens
 * assert('')         // Throws AssertionError
 * assert(false)      // Throws AssertionError
 * etc.
 *
 * @param {any} value Value to be asserted.
 * @param {string} [message] Optional message.
 * @returns {void}
 */
const assert = (value: any, message?: string | Error) => baseAssert.ok(value, message);

assert.areNotNil = areNotNil;
assert.areNotEmpty = areNotEmpty;

export default assert;
