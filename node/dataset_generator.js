const fs = require('fs')
const path = require('path')
const draw = require('../common/draw')
const constants = require('../common/constants')
const utils = require('../common/utils')

const canvas = require('canvas').createCanvas(400, 400)
const ctx = canvas.getContext('2d')

// read files in raw dir synchronously
const files = fs.readdirSync(resolve(constants.RAW_DIR))

const samples = []
let index = 0
// read session, user, drawings from each file synchronously, then put them in to samples
files.forEach(file => {
    const { session, student, drawings } = JSON.parse(fs.readFileSync(resolve(constants.RAW_DIR + '/' + file)))
    for (let label in drawings) {
        samples.push({
            id: index,
            user_id: session,
            user: student,
            label,
        })

        const paths = drawings[label]
        fs.writeFileSync(resolve(constants.JSON_DIR + '/' + index + '.json'), JSON.stringify(paths, null, 2))

        generateImageFile(resolve(constants.IMG_DIR + '/' + index + '.png'), paths)

        utils.printProgess(index + 1, files.length * 8)
        index++
    }
})

// write samples to samples.json
fs.writeFileSync(resolve(constants.SAMPLES), JSON.stringify(samples, null, 2))
fs.writeFileSync(
    resolve(constants.JS_OBJECT + '/' + 'sample.js'), 
    `const samples = ${JSON.stringify(samples, null, 2)}`
)

function generateImageFile(output, paths) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw.paths(ctx, paths)

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(output, buffer)
}

function resolve(file) {
    return (__dirname, file)
}