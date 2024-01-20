if (typeof geometry === 'undefined') {
    console.log('feature')
    geometry = require('../common/geometry')
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

featureFunctions.inUse = [
    { name: 'width', func: featureFunctions.width },
    { name: 'height', func: featureFunctions.height },
    { name: 'elongation', func: featureFunctions.elongation },
]

if (typeof module !== 'undefined' && module.exports) {
    module.exports = featureFunctions
}
