if (typeof utils === 'undefined') {
    utils = require('./utils')
}
if (typeof geometry === 'undefined') {
    geometry = require('./geometry')
}

if (typeof draw === 'undefined') {
    draw = require('./draw')
}

const featureFunctions = Object.create(null)

featureFunctions.pathCount = (paths) => paths.length

featureFunctions.pointCount = (paths) => paths.flat().length

featureFunctions.width = (paths) => {
    const points = paths.flat()
    const xs = points.map(p => p[0])
    return Math.max(...xs) - Math.min(...xs)
}

featureFunctions.height = (paths) => {
    const points = paths.flat()
    const ys = points.map(p => p[1])
    return Math.max(...ys) - Math.min(...ys)
}

featureFunctions.elongation = (paths) => {
    const points = paths.flat()
    const { width, height } = geometry.minimumBoundingBox({ points })
    return (Math.max(width, height) + 1) / (Math.min(width, height) + 1)
}

featureFunctions.roundness = (paths) => {
    const points = paths.flat()
    const { hull } = geometry.minimumBoundingBox({ points })
    return geometry.roundness(hull)
}

featureFunctions.pixelsFromPaths = (paths, size = 400, expand = true) => {
    let canvas = null

    try {
        canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
    } catch (_err) {
        const { createCanvas } = require('../node/node_modules/canvas')
        canvas = createCanvas(size, size)
    }

    const ctx = canvas.getContext('2d')

    if (expand == true) {
        const points = paths.flat()
        const bounds = {
            left: Math.min(...points.map(p => p[0])),
            right: Math.max(...points.map(p => p[0])),
            top: Math.min(...points.map(p => p[1])),
            bottom: Math.max(...points.map(p => p[1])),
        }

        const newPaths = []
        for (const path of paths) {
            const newPath = path.map(p => {
                return [
                    utils.inverseLerp(bounds.left, bounds.right, p[0]) * size,
                    utils.inverseLerp(bounds.top, bounds.bottom, p[1]) * size,
                ]
            })
            newPaths.push(newPath)
        }
        draw.paths(ctx, newPaths)
    } else {
        draw.paths(ctx, paths)
    }

    const imgData = ctx.getImageData(0, 0, size, size)

    // get alpha data
    return imgData.data.filter((_, index) => index % 4 === 3)
}

featureFunctions.complexity = (paths) => {
    const pixels = featureFunctions.pixelsFromPaths(paths)

    return pixels.filter(p => p != 0).length
}


featureFunctions.inUse = [
    { name: 'width', func: featureFunctions.width },
    { name: 'height', func: featureFunctions.height },
    { name: 'elongation', func: featureFunctions.elongation },
    { name: 'roundness', func: featureFunctions.roundness },
    { name: 'complexity', func: featureFunctions.complexity },
]

if (typeof module !== 'undefined' && module.exports) {
    module.exports = featureFunctions
}
