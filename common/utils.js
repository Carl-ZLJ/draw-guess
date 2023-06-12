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

utils.inverseLerp = (a, b, v) => {
    return (v - a) / (b - a)
}

utils.normalizePoints = (points, minMax) => {
    let min, max
    const dimensions = points[0].length

    if (minMax) {
        min = minMax.min
        max = minMax.max
    } else {
        min = [...points[0]]
        max = [...points[0]]
        for (let i = 1; i < points.length; i++) {
            for (let j = 0; j < dimensions; j++) {
                min[j] = Math.min(min[j], points[i][j])
                max[j] = Math.max(max[j], points[i][j])
            }
        }
    }

    for (let i = 0; i < points.length; i++) {
        for (let j = 0; j < dimensions; j++) {
            points[i][j] = utils.inverseLerp(min[j], max[j], points[i][j])
        }
    }

    return {
        min,
        max,
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils
}