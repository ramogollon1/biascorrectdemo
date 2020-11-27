module.exports = {
  randomValue: (corrections) => {
    if (!corrections) return [];
    let lenght = corrections.length;
    let value = Math.floor(Math.random() * (lenght - 0));
    return [corrections[value]];
  },
};
