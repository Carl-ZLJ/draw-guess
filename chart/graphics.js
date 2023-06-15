const graphics = Object.create(null)

graphics.drawPoint = (ctx, loc, color = 'black', size = 8) => {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.arc(...loc, size / 2, 0, 2 * Math.PI)
    ctx.fill()
}

graphics.drawLine = (ctx, p1, p2, color = 'pink') => {
    ctx.beginPath()
    ctx.strokeStyle = color
    ctx.lineWidth = 1
    ctx.moveTo(...p1)
    ctx.lineTo(...p2)
    ctx.stroke()
}

graphics.drawText = (ctx, { text, loc, color = 'black', align = 'center', baseline = 'middle', size = 10 }) => {
    ctx.beginPath()
    ctx.fillStyle = color
    ctx.textAlign = align
    ctx.textBaseline = baseline
    ctx.font = `${size}px Courier`
    ctx.fillText(text, ...loc)

}

graphics.generateImages = async (styles, size = 20) => {
    for (const label in styles) {
        const style = styles[label]
        const canvas = document.createElement('canvas')
        canvas.width = size
        canvas.height = size
        const ctx = canvas.getContext('2d')
        ctx.beginPath()
        ctx.textAlign = 'center'
        ctx.textBaseline = 'middle'
        ctx.font = `${size}px Courier`

        const colorHueMap = {
            red: 0,
            yellow: 60,
            green: 120,
            cyan: 180,
            blue: 240,
            magenta: 300,
        }
        const hue = -45 + colorHueMap[style.color]
        if (!isNaN(hue)) {
            ctx.filter = `
                brightness(2)
                contrast(0.3)
                sepia(1) 
                hue-rotate(${hue}deg)
                saturate(3)
            `
        } else {
            ctx.filter = 'grayscale(1)'
        }

        ctx.fillText(style.text, canvas.width / 2, canvas.height / 2)

        style['image'] = new Image()
        style['image'].src = canvas.toDataURL()
    }
}

graphics.drawImage = (ctx, image, loc) => {
    ctx.beginPath()
    ctx.drawImage(
        image,
        loc[0] - image.width / 2,
        loc[1] - image.height / 2,
        image.width,
        image.height
    )
    ctx.fill()
}