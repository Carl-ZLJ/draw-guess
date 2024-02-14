if (typeof utils === 'undefined') {
    utils = require('../utils.js')
}

if (typeof NeuralNetwork === 'undefined') {
    NeuralNetwork = require('../network.js')
}

class MLP {
    constructor(neuronCounts, classses) {
        this.neuronCounts = neuronCounts
        this.classses = classses
        this.network = new NeuralNetwork(neuronCounts)
    }

    load(mlp) {
        this.neuronCounts = mlp.neuronCounts
        this.classses = mlp.classses
        this.network = mlp.network
    }

    predict(point) {
        const output = NeuralNetwork.feedForward(point, this.network)
        const max = Math.max(...output)
        const index = output.indexOf(max)
        const label = this.classses[index]
        return {
            label,
        }
    }

    fit(samples, tries = 1000) {
        let bestNetwork = this.network
        let bestAccuracy = this.evaluate(samples)
        for (let i = 0; i < tries; i++) {
            this.network = new NeuralNetwork(this.neuronCounts)
            const accuracy = this.evaluate(samples)

            if (accuracy > bestAccuracy) {
                bestNetwork = this.network
                bestAccuracy = accuracy
            }

        }

        this.network = bestNetwork
    }

    evaluate(samples) {
        let correctCount = 0
        for (const sample of samples) {
            const { label } = this.predict(sample.point)
            correctCount += (label == sample.label ? 1 : 0)
        }
        return correctCount / samples.length
    }

}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = MLP
}
