const utils = Object.create(null)

utils.styles = {
    // generate different color and emojis for different categories
    'car': { color: 'gray', text: '🚗' },
    'fish': { color: 'red', text: '🐟' },
    'house': { color: 'yellow', text: '🏠' },
    'tree': { color: 'green', text: '🌲' },
    'bicycle': { color: 'cyan', text: '🚲' },
    'guitar': { color: 'blue', text: '🎸' },
    'pencil': { color: 'magenta', text: '✏️' },
    'clock': { color: 'lightgray', text: '🕒' },
}


utils.printProgess = function (current, total) {
    process.stdout.clearLine()
    process.stdout.cursorTo(0)

    process.stdout.write(`Progress: ${current}/${total} (${(current / total * 100).toFixed(2)}%)`)

}

utils.groupBy = function(objs, key) {
    const result = {}
    objs.forEach(obj => {
        const value = obj[key]
        if (!result[value]) {
            result[value] = []
        }
        result[value].push(obj)
    })
    return result
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils
}