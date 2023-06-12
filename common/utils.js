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

utils.distance = (a, b) => {
    return Math.sqrt(
        (b[1] - a[1]) ** 2 + (b[0] - a[0]) ** 2
    )
}

utils.findNearest = (point, points) => {
    let minDist = Infinity
    let minIndex = -1
    for (let i = 0; i < points.length; i++) {
        const dist = utils.distance(point, points[i])
        if (dist < minDist) {
            minDist = dist
            minIndex = i
        }
    }
    return minIndex
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils
}