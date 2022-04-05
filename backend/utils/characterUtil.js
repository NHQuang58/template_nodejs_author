/**
 * ex: capitalizeFirstLetter('abc xyz') => Abc xyz
 */
const capitalizeFirstLetter = (string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};
/**
 * num > 0
 * ex: numberToAlphabet(1) => 'A'
 */
const numberToAlphabet = (num) => {
  // return (number + 9).toString(36).toUpperCase();
  let s = '', t;

  while (num > 0) {
    t = (num - 1) % 26;
    s = String.fromCharCode(65 + t) + s;
    num = (num - t)/26 | 0;
  }
  return s || undefined;
}

/**
 * ex: { accountId: 'QuangNH33'} => { accountId: 'quangnh33'}
 */
const lowerCaseValue = (originObj, exclude = []) => {
  const newObj = Object.keys(originObj).reduce((acc, cur) => {
    typeof originObj[cur] === "string" && !exclude.includes(cur)
      ? (acc[cur] = originObj[cur].toLowerCase())
      : (acc[cur] = originObj[cur]);
    return acc;
  }, {});
  return newObj;
};

/**
 * ex: upperCaseAfterChar('abc xyz bdc', ' ') => abc Xyz Bdc
 */
const upperCaseAfterChar = (originString, character) => {
  let returnStr = originString;
  for (let index = 0; index < originString.length; index++) {
    if (originString[index] === character) {
      console.log("index= ", index);
      returnStr =
        returnStr.slice(0, index + 1) +
        returnStr.charAt(index + 1).toUpperCase() +
        returnStr.slice(index + 2);
    }
  }
  return returnStr;
};

module.exports = {
  capitalizeFirstLetter,
  numberToAlphabet,
  lowerCaseValue,
  upperCaseAfterChar,
} ;
