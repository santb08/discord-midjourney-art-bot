const setRandomTime = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min) * 1000
}

module.exports = setRandomTime
