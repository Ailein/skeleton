'use strict';

/**
 * Capitalize the first letter of a string
 */

exports.capitalize = function (str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Generate a random key
 */

exports.randomKey = function (len) {

  var buf = [];
  var chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  var charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  }

  return buf.join('');
};

/**
 * Get a random number between a min and max number
 */

function getRandomInt (min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Encode Base32
 * NOTE: Code borrowed from "thirty-two" library on NPM but is no longer maintained
 */

var charTable = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';

function quintetCount (buff) {
  var quintets = Math.floor(buff.length / 5);
  return buff.length % 5 === 0 ? quintets: quintets + 1;
}

exports.encode = function (plain) {
  var i = 0;
  var j = 0;
  var shiftIndex = 0;
  var digit = 0;
  var encoded = new Array(quintetCount(plain) * 8);

  while (i < plain.length) {

  /* Javascript bitwise operators:  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Bitwise_Operators
      <<   Left shifts the bits of an expression. result = expression1 << expression2
      >>   The >> operator shifts the bits of expression1 right by the number of bits specified in expression2
      &    Performs a bitwise AND operation on two 32-bit expressions.
      |    The | operator looks at the binary representation of the values of two expressions and does a bitwise OR operation on them
  */

    var current = plain.charCodeAt(i);

    if (shiftIndex > 3) {
      digit = current & (0xff >> shiftIndex);
      shiftIndex = (shiftIndex + 5) % 8;
      digit = (digit << shiftIndex) | ((i + 1 < plain.length) ?
        plain.charCodeAt(i + 1) : 0) >> (8 - shiftIndex);
      i++;
    } else {
      digit = (current >> (8 - (shiftIndex + 5))) & 0x1f;
      shiftIndex = (shiftIndex + 5) % 8;
      if (shiftIndex === 0) {
        i++;
      }
    }

    encoded[j] = charTable[digit];
    j++;
  }

  for (i = j; i < encoded.length; i++) {
    encoded[i] = '=';
  }

  return encoded.join('');
};
