if (typeof utils === 'undefined') {
    utils = require('../utils')
}

class KNN {
    constructor(samples, k) {
        this.samples = samples
        this.k = k
    }

    predict(point) {
        const { samples, k } = this
        const points = samples.map(s => s.point)
        const indexs = utils.findNearest(point, points, k)
        const nearestSamples = indexs.map(i => samples[i])
        const labels = nearestSamples.map(s => s.label)
        const label = utils.findMostFrequent(labels)
        return {
            label,
            nearestSamples,
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = KNN
}
