const constants = require('../common/constants')
const KNN = require('../common/classifiers/knn')

const fs = require('fs')


console.log('RUNNING CLASSIFICATION ...')

const { samples: trainingSamples } = JSON.parse(
    fs.readFileSync(constants.TRAINING)
)

const knn = new KNN(trainingSamples, 50)

const { samples: testingSamples } = JSON.parse(
    fs.readFileSync(constants.TESTING)
)

let totalCount = 0
let correctCount = 0
for (const sample of testingSamples) {
    const { label: prediction } = knn.predict(sample.point)
    totalCount++
    correctCount += prediction === sample.label ? 1 : 0
}

console.log(`Accuracy: ${correctCount} / ${totalCount} (${correctCount / totalCount * 100}%)`)


console.log('GENARATING DECISION BOUNDARY ...')

const canvas = require('canvas').createCanvas(100, 100)
const ctx = canvas.getContext('2d')

for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
        const point = [
            i / canvas.width,
            1 - j / canvas.height, 
        ]
        const { label } = knn.predict(point)
        const color = utils.styles[label].color
        ctx.fillStyle = color
        ctx.fillRect(i, j, 1, 1)
    }
}

const buffer = canvas.toBuffer('image/png')

fs.writeFileSync(constants.DECISION_BOUNDARY, buffer)

console.log('DONE')