module.exports = {
  randomValue: (corrections) => {
    if (!corrections) return [];
    let lenght = corrections.length;
    let value = Math.floor(Math.random() * (lenght - 0));
    return [corrections[value]];
  },
  isObjectEmpty: (obj) => {
    for (var prop in obj) {
      if (obj.hasOwnProperty(prop)) {
        return false;
      }
    }
    return JSON.stringify(obj) === JSON.stringify({});
  },
};
