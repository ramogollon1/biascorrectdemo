module.exports = {
    randomValue: (corrections) => {
        let lenght = corrections.length;
        let value = Math.floor(Math.random() * (lenght - 0));
        return [corrections[value]];
    }
}