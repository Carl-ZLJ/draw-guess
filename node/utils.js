const path = require('path')
const fs = require('fs')
const process = require('process')
const canvas = require('canvas').createCanvas(400, 400)
const ctx = canvas.getContext('2d')
const draw = require('../common/draw')
// const geometry = require('../common/geometry')
const features = require('../common/features')

function resolve(dir) {
    return path.resolve(process.cwd(), dir)
}

function generateImageFile(output, paths) {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    draw.paths(ctx, paths)

    // const { vertices, hull } = geometry.minimumBoundingBox({
    //     points: paths.flat()
    // })

    // no-linear function
    // const roundness = geometry.roundness(hull)
    // const R = 255 - Math.floor(roundness ** 5 * 255)
    // const G = 255 - 0
    // const B = 255 - Math.floor((1 - roundness ** 5) * 255)
    // const color = `rgb(${R}, ${G}, ${B})`
    // draw.path(ctx, [...vertices, vertices[0]], "red")
    // draw.path(ctx, [...hull, hull[0]], color)

    const pixels = features.pixelsFromPaths(paths)
    const size = Math.sqrt(pixels.length)
    const imgData = ctx.getImageData(0, 0, size, size)
    for(let i = 0; i < pixels.length; i++) {
        const alpha = pixels[i]
        const startIndex = i * 4
        imgData.data[startIndex] = 0
        imgData.data[startIndex + 1] = 0
        imgData.data[startIndex + 2] = 0
        imgData.data[startIndex + 3] = alpha
    }
    ctx.putImageData(imgData, 0, 0)

    const buffer = canvas.toBuffer('image/png')
    fs.writeFileSync(output, buffer)
}

module.exports = {
    resolve,
    generateImageFile,
}
