/**
 * Lyn's JavaScript utility functions for CS317
 */

/**
 * Returs a new array with val followed by the elements of array.
 * For example:
 *
 *   let a1 = [8, 3, 5]
 *   prepend(17, a1) returns [17, 8, 3, 5] *without* changing a1
 */
export function prepend(val, array) {
    return [val, ...array];
  }
  
  /**
   * Returns `true if `val` is an element in the array `arr`
   * (as determined by ===), and `false` otherwise.
   * This is similar to Python's `val in array`
   * For example:
   *
   *   isIn(3, [8, 3, 5, 8, 2]) = true
   *   isIn(8, [8, 3, 5, 8, 2]) = true
   *   isIn(7, [8, 3, 5, 8, 2]) = false
   */
  export function isIn(val, array) {
    return array.indexOf(val) !== -1;
  }
  
  /**
   * Returns the sum of an array of numbers.
   * For example:
   *
   *   sum([8, 3, 5, 17, 9] returns 42
   */
  export function sum(arr) {
    let add = (sumSoFar, num) => sumSoFar + num;
    return arr.reduce(add, 0);
  }
  
  /**
   * Returns the integer quotient of dividing numer by denom.
   * The integer quotient is the integer q such that
   * numer = q*denom + (numer % denom). For example:
   *
   * + quotient(17, 5) = 3 because 17 = 3*5 + 2 (where 17 % 5 is 2)
   * + quotient(-17, 5) = -3 because -17 = -3*5 + -2 (where -17 % 5 is -2)
   * + quotient(17, -5) = -3 because 17 = -3*-5 + 2 (where 17 % -5 is 2)
   * + quotient(-17, -5) = 3 because -17 = 3*-5 + -2 (where -17 % -5 is -2)
   *
   */
  
  export function quotient(numer, denom) {
    return Math.trunc(numer / denom);
  }
  
  /**
   * Python-like range function in JavaScript.
   *
   * Assume that start, stop, and step are all integers, and step is non-zero.
   *
   * + If step > 0 and stop > start, then range(start, stop, step) returns an array
   *   of integers [start, start+step, start+2*step, start+3*step, ...]
   *   such that all integers in the array are *strictly less* than stop
   *   (i.e., stop is *exclusive*, not *inclusive*) For example:
   *
   *     range(0, 5, 1) returns [0, 1, 2, 3, 4]
   *     range(-7, 15, 4) returns [-7, -3, 1, 5, 9, 13]
   *
   * + If step < 0 and stop < start, then range(start, stop, step) returns an array
   *   of integers [start, start-step, start+2*step, start+3*step, ...]
   *   such that all integers in the array are *strictly greater* than stop
   *   (i.e., stop is *exclusive*, not *inclusive*) For example:
   *
   *     range(0, -5, -1) returns [0, -1, -2, -3, -4]
   *     range(6, -10, -3) returns [6, 3, 0, -3, -6, -9]
   *
   * + If step is not provided, it defaults to 1. For example
   *
   *     range(3, 7) returns [3, 4, 5, 6]
   *     range(7, 3) returns [] // since even 7 is not < 3.
   *
   * + With one argument, range(n) is treated like range(0, n). For example
   *
   *     range(5) returns [0, 1, 2, 3, 4]
   *     range(-5) returns []
   *
   * + In all other cases, range returns [] rather than givning an error.
   *
   * The following implementation is Lyn's, but is informed by
   * https://stackoverflow.com/questions/8273047/javascript-function-similar-to-python-range
   *
   */
  export function range(start, stop, step) {
    if (!Number.isInteger(start)) {
      return [];
    }
    if (stop === undefined) {
      stop = start;
      start = 0;
    } else if (stop === 0 || !Number.isInteger(stop)) {
      return [];
    }
    if (step === undefined) {
      step = 1;
    } else if (!Number.isInteger(step)) {
      return [];
    }
    if ((stop - start) * step < 0) {
      // I.e. (((stop > start) && (step < 0))
      //       || ((stop < start) && (step > 0)))
      return [];
    }
    let largestIndex = quotient(Math.abs(stop - start) - 1, Math.abs(step));
    let indices = Array.from(Array(largestIndex + 1).keys());
    return indices.map((i) => i * step + start);
  }
  
  /*
  export default {
      prepend: prepend,
      quotient: quotient,
      range: range,    
      sum: sum,     
      }
      */
  