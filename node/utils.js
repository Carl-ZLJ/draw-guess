const path = require('path')
const fs = require('fs')
const process = require('process')
const canvas = require('canvas').createCanvas(400, 400)
const ctx = canvas.getContext('2d')
const draw = require('../common/draw')

function resolve(dir) {
    return path.resolve(process.cwd(), dir)
}

function generateImageFile(output, paths) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw.paths(ctx, paths)

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(output, buffer)
}

module.exports = {
    resolve,
    generateImageFile,
}