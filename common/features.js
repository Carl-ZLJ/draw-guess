
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

featureFunctions.inUse = [
    { name: 'width', func: featureFunctions.width },
    { name: 'height', func: featureFunctions.height },
]

if (typeof module !== 'undefined' && module.exports) {
    module.exports = featureFunctions
}