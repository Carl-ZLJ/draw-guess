const constants = require('../common/constants')
const KNN = require('../common/classifiers/knn')
const { resolve } = require('./utils')
const { log } = require('console')
const fs = require('fs')
const utils = require('../common/utils')


log('RUNNING CLASSIFICATION ...')

const { samples: trainingSamples } = JSON.parse(
    fs.readFileSync(resolve(constants.TRAINING))
)

const knn = new KNN(trainingSamples, 50)

const { samples: testingSamples } = JSON.parse(
    fs.readFileSync(resolve(constants.TESTING))
)

let totalCount = 0
let correctCount = 0
for (const sample of testingSamples) {
    const { label: prediction } = knn.predict(sample.point)
    totalCount++
    correctCount += prediction === sample.label ? 1 : 0
}

log(`Accuracy: ${correctCount} / ${totalCount} (${correctCount / totalCount * 100}%)`)


log('GENERATING DECISION BOUNDARY ...')

const canvas = require('canvas').createCanvas(100, 100)
const ctx = canvas.getContext('2d')

for (let i = 0; i < canvas.width; i++) {
    for (let j = 0; j < canvas.height; j++) {
        const point = [
            i / canvas.width,
            1 - j / canvas.height, 
        ]
        // more dimension
        while (point.length < trainingSamples[0].point.length) {
            point.push(0)
        }
        const { label } = knn.predict(point)
        const color = utils.styles[label].color
        ctx.fillStyle = color
        ctx.fillRect(i, j, 1, 1)
    }
    utils.printProgress(i + 1, canvas.width)
}

const buffer = canvas.toBuffer('image/png')

fs.writeFileSync(resolve(constants.DECISION_BOUNDARY), buffer)

log('\nDONE')
