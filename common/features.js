const { log } = require("console")

const features = {}

features.pathCount = function (paths) {
    return paths.length
}

features.pointsCount = function (paths) {
    let len = 0
    for (const path of paths) {
        len += path.length
    }
    return len
}

if (module !== undefined && module.exports) {
    module.exports = features
}