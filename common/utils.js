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
    '?': { color: 'red', text: '❓' },
}

utils.classes = [
    'car',
    'fish',
    'house',
    'tree',
    'bicycle',
    'guitar',
    'pencil',
    'clock',
]

utils.flaggedSamples = [
    77,
    78,
    120,
    216,
    304,
    353,
    380,
    378,
    438,
    439,
    437,
    436,
    435,
    434,
    433,
    432,
    657,
    656,
    658,
    659,
    660,
    800,
    801,
    802,
    803,
    804,
    880,
    1314,
    1360,
    1361,
    1362,
    1363,
    1364,
    1365,
    1366,
    1586,
    1578,
    1610,
    1608,
    1609,
    2017,
    2018,
    2019,
    2021,
    2030,
    2649,
    2651,
    2791,
    3376,
    3377,
    3378,
    3379,
    3380,
    3381,
    3382,
    3383,
    3402,
    3426,
    3536,
    3537,
    3538,
    3539,
    3540,
    3541,
    3542,
    3543,
    3696,
    3697,
    3698,
    3699,
    3700,
    3701,
    3702,
    3703,
    3877
]

utils.printProgress = function(current, total) {
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
    let sqDist = 0
    for (let i = 0; i < a.length; i++) {
        sqDist += (a[i] - b[i]) ** 2
    }

    return Math.sqrt(sqDist)
}

utils.findNearest = (point, points, k = 1) => {
    // let minDist = Infinity
    // let minIndex = -1
    // for (let i = 0; i < points.length; i++) {
    //     const dist = utils.distance(point, points[i])
    //     if (dist < minDist) {
    //         minDist = dist
    //         minIndex = i
    //     }
    // }
    // return minIndex
    const objs = points.map((p, index) => ({ p, index }))
    const sorted = objs.sort((a, b) =>
        utils.distance(point, a.p) - utils.distance(point, b.p)
    )
    const indexes = sorted.map(obj => obj.index)
    return indexes.slice(0, k)
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

utils.findMostFrequent = (labels) => {
    const count = {}
    for (const label of labels) {
        count[label] = (count[label] || 0) + 1
    }
    const max = Math.max(...Object.values(count))
    return labels.find(label => count[label] === max)
}

utils.toCSV = (headers, samples) => {
    let str = headers.join(',') + '\n'
    for (const sample of samples) {
        str += sample.join(',') + '\n'
    }
    return str
}


if (typeof module !== 'undefined' && module.exports) {
    module.exports = utils
}
