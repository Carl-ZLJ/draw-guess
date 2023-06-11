const { log } = require("console")

const features = {}

features.pathCount = function (paths) {
    return paths.length
}

features.pointsCount = function (paths) {
    return paths.flat().length
}

if (module !== undefined && module.exports) {
    module.exports = features
}