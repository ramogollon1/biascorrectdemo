module.exports = {
    randomValue: (corrections) => {
        let lenght = corrections.length;
        let value = Math.floor(Math.random() * (lenght - 0));
        console.log('corrections random', corrections[value])
        return [corrections[value]];
    },
    randomValue2: (corrections, text) => {
        let lenght = corrections.length;
        let value = Math.floor(Math.random() * (lenght - 0));
        console.log('corrections random', corrections[value])
        return [corrections[value]];
    }
}