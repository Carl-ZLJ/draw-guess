draw = Object.create(null)

draw.path = (ctx, path, color = 'black') => {
    ctx.strokeStyle = color
    ctx.lineWidth = 3
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(...path[0])
    for (let i = 1; i < path.length; i++) {
        ctx.lineTo(...path[i])
    }
    ctx.stroke()
}

draw.paths = (ctx, paths, color = 'black') => {
    for (const path of paths) {
        draw.path(ctx, path, color)
    }
}

draw.text = (ctx, text, color = 'black', loc = [0, 0], size = 100) => {
    ctx.font = `bold ${size}px Courier`
    ctx.textBaseline = 'top'
    ctx.fillStyle = color
    ctx.fillText(text, ...loc)
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = draw
}