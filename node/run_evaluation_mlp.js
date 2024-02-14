const constants = require('../common/constants')
const MLP = require('../common/classifiers/mlp')
const { resolve } = require('./utils')
const { log } = require('console')
const fs = require('fs')
const utils = require('../common/utils')


log('RUNNING CLASSIFICATION ...')

const { samples: trainingSamples } = JSON.parse(
    fs.readFileSync(resolve(constants.TRAINING))
)

const mlp = new MLP(
    [trainingSamples[0].point.length, utils.classes.length],
    utils.classes,
)

if (fs.existsSync(constants.MODEL)) {
    mlp.load(JSON.parse(fs.readFileSync(constants.MODEL)))
}

mlp.fit(trainingSamples, 5000)

fs.writeFileSync(resolve(constants.MODEL), JSON.stringify(mlp))

fs.writeFileSync(resolve(constants.MODEL_JS), 
    `const model = ${JSON.stringify(mlp)}`
)

const { samples: testingSamples } = JSON.parse(
    fs.readFileSync(resolve(constants.TESTING))
)

let totalCount = 0
let correctCount = 0
for (const sample of testingSamples) {
    const { label: prediction } = mlp.predict(sample.point)
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
        const { label } = mlp.predict(point)
        const color = utils.styles[label].color
        ctx.fillStyle = color
        ctx.fillRect(i, j, 1, 1)
    }
    utils.printProgress(i + 1, canvas.width)
}

const buffer = canvas.toBuffer('image/png')

fs.writeFileSync(resolve(constants.DECISION_BOUNDARY), buffer)

log('\nDONE')
