class Chart {
    constructor(container, samples, options, clickCallBack = null) {
        // samples {
        // id: i,
        // label: type,
        // point: [Math.round(km), Math.round(price)]
        // }
        this.samples = samples
        this.axesLabels = options.axesLabels
        this.styles = options.styles
        this.icon = options.icon
        this.onClick = clickCallBack

        this.canvas = document.createElement('canvas')
        this.canvas.width = options.size
        this.canvas.height = options.size
        this.canvas.style.backgroundColor = 'white'
        container.appendChild(this.canvas)

        this.ctx = this.canvas.getContext('2d')
        this.margin = options.size * 0.1
        this.opacity = options.opacity || 1

        this.dataTrans = {
            offset: [0, 0],
            scale: 1,
        }

        this.dragInfo = {
            start: [0, 0],
            end: [0, 0],
            offset: [0, 0],
            dragging: false,
        }

        this.pixelBounds = this.#pixelBounds()
        this.dataBounds = this.#dataBounds()
        this.defaultDataBounds = this.#dataBounds()
        this.hoveredSample = null
        this.selectedSample = null
        this.dynamicPoint = null
        this.nearestSamples = null

        this.#draw()

        this.#addEventListeners()
    }
    #addEventListeners() {
        const { canvas, dataTrans, dragInfo } = this
        canvas.addEventListener('mousedown', e => {
            const dataLoc = this.#getMouse(e, true)
            dragInfo.start = dataLoc
            dragInfo.dragging = true
            dragInfo.offset = [0, 0]
        })

        canvas.addEventListener('mousemove', e => {
            if (dragInfo.dragging) {
                const dataLoc = this.#getMouse(e, true)
                dragInfo.end = dataLoc
                dragInfo.offset = math.scale(
                    math.substract(dragInfo.start, dragInfo.end),
                    dataTrans.scale ** 2,
                )
                const newOffest = math.add(dataTrans.offset, dragInfo.offset)
                this.#updateDataBounds(newOffest, dataTrans.scale)
            }
            const pixelLoc = this.#getMouse(e)
            const pixelPoints = this.samples.map(s =>
                math.remapPoint(this.dataBounds, this.pixelBounds, s.point)
            )
            const index = math.findNearest(pixelLoc, pixelPoints)
            const dist = math.distance(pixelPoints[index], pixelLoc)
            if (dist < this.margin / 2) {
                this.hoveredSample = this.samples[index]
            } else {
                this.hoveredSample = null
            }

            this.#draw()
        })

        document.addEventListener('mouseup', e => {
            dragInfo.dragging = false
            dataTrans.offset = math.add(dataTrans.offset, dragInfo.offset)
        })

        canvas.addEventListener('wheel', e => {
            e.preventDefault()
            const dir = Math.sign(e.deltaY)
            const step = 0.02
            dataTrans.scale += dir * step
            dataTrans.scale = Math.max(step, Math.min(2, dataTrans.scale))

            this.#updateDataBounds(dataTrans.offset, dataTrans.scale)
            this.#draw()
        })

        canvas.addEventListener('click', e => {
            if (!math.equal(dragInfo.offset, [0, 0])) return
            if (this.hoveredSample) {
                this.selectedSample =
                    this.selectedSample == this.hoveredSample
                        ? null
                        : this.hoveredSample
            } else {
                this.selectedSample = null
            }
            if (this.onClick) {
                this.onClick(this.selectedSample)
            }
            this.#draw()
        })
    }

    #updateDataBounds(offset, scale) {
        const { dataBounds, defaultDataBounds: def } = this
        dataBounds.left = def.left + offset[0]
        dataBounds.right = def.right + offset[0]
        dataBounds.top = def.top + offset[1]
        dataBounds.bottom = def.bottom + offset[1]

        const center = [
            (dataBounds.left + dataBounds.right) / 2,
            (dataBounds.top + dataBounds.bottom) / 2,
        ]
        // scale at same level from beginning to end
        dataBounds.left = math.lerp(center[0], dataBounds.left, scale ** 2)
        dataBounds.right = math.lerp(center[0], dataBounds.right, scale ** 2)
        dataBounds.top = math.lerp(center[1], dataBounds.top, scale ** 2)
        dataBounds.bottom = math.lerp(center[1], dataBounds.bottom, scale ** 2)
    }

    #getMouse(e, dataSpace = false) {
        const { canvas, pixelBounds, defaultDataBounds } = this
        const rect = canvas.getBoundingClientRect()
        const p = [
            e.clientX - rect.left,
            e.clientY - rect.top,
        ]
        return dataSpace ? math.remapPoint(pixelBounds, defaultDataBounds, p) : p
    }

    #pixelBounds() {
        const { canvas, margin } = this
        return {
            top: margin,
            bottom: canvas.height - margin,
            left: margin,
            right: canvas.width - margin,
        }
    }

    #dataBounds() {
        const { samples } = this
        const xValues = samples.map(sample => sample.point[0])
        const yValues = samples.map(sample => sample.point[1])
        const xMin = Math.min(...xValues)
        const xMax = Math.max(...xValues)
        const yMin = Math.min(...yValues)
        const yMax = Math.max(...yValues)
        // const deltaX = xMax - xMin
        // const deltaY = yMax - yMin
        // const maxDelta = Math.max(deltaX, deltaY)
        return {
            top: yMax,//yMin + maxDelta,
            bottom: yMin,
            left: xMin,
            right: xMax,//xMin + maxDelta,
        }
    }

    #draw() {
        const { ctx, canvas } = this
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        ctx.globalAlpha = this.opacity
        this.#drawSamples(this.samples)
        ctx.globalAlpha = 1

        if (this.hoveredSample) {
            this.#emphasizeSample(this.hoveredSample)
        }

        if (this.selectedSample) {
            this.#emphasizeSample(this.selectedSample, 'yellow')
        }

        if (this.dynamicPoint) {
            const { point, label } = this.dynamicPoint
            const pixelLoc = math.remapPoint(
                this.dataBounds,
                this.pixelBounds,
                point,
            )
            graphics.drawPoint(ctx, pixelLoc, 'rgba(0, 0, 0, 0.7)', 10000000)
            if (this.nearestSamples) {
                for (const sample of this.nearestSamples) {
                    const pixelLocN = math.remapPoint(
                        this.dataBounds,
                        this.pixelBounds,
                        sample.point,
                    )
                    graphics.drawLine(ctx, pixelLoc, pixelLocN)
                }
            }
            graphics.drawImage(ctx, this.styles[label].image, pixelLoc)
        }


        this.#drawAxes()
    }

    #drawAxes() {
        const { ctx, canvas, pixelBounds, axesLabels, margin } = this
        const { top, bottom, left, right } = pixelBounds
        ctx.clearRect(0, 0, this.canvas.width, margin)
        ctx.clearRect(0, 0, margin, this.canvas.height)
        ctx.clearRect(0, this.canvas.height - margin, this.canvas.width, margin)
        ctx.clearRect(this.canvas.width - margin, 0, margin, this.canvas.height)

        graphics.drawText(ctx, {
            text: axesLabels[0],
            loc: [canvas.width / 2, bottom + margin / 2],
            size: margin * 0.5,
        })

        ctx.save()
        ctx.translate(left - margin / 2, canvas.height / 2)
        ctx.rotate(-Math.PI / 2)
        graphics.drawText(ctx, {
            text: axesLabels[1],
            loc: [0, 0],
            size: margin * 0.5,
        })
        ctx.restore()

        ctx.beginPath()
        ctx.moveTo(left, top)
        ctx.lineTo(left, bottom)
        ctx.lineTo(right, bottom)
        ctx.setLineDash([5, 4])
        ctx.lineWidth = 2
        ctx.strokeStyle = 'lightgray'
        ctx.stroke()
        ctx.setLineDash([])

        const dataMin = math.remapPoint(pixelBounds, this.dataBounds, [left, bottom])
        graphics.drawText(ctx, {
            text: Math.round(dataMin[0]),
            loc: [left, bottom],
            size: margin * 0.3,
            align: 'left',
            baseline: 'top',
        })

        ctx.save()
        ctx.translate(left, bottom)
        ctx.rotate(-Math.PI / 2)
        graphics.drawText(ctx, {
            text: Math.round(dataMin[1]),
            loc: [0, 0],
            size: margin * 0.3,
            align: 'left',
            baseline: 'bottom',
        })
        ctx.restore()

        const dataMax = math.remapPoint(pixelBounds, this.dataBounds, [right, top])
        graphics.drawText(ctx, {
            text: Math.round(dataMax[0]),
            loc: [right, bottom],
            size: margin * 0.3,
            align: 'right',
            baseline: 'top',
        })

        ctx.save()
        ctx.translate(left, top)
        ctx.rotate(-Math.PI / 2)
        graphics.drawText(ctx, {
            text: Math.round(dataMax[1]),
            loc: [0, 0],
            size: margin * 0.3,
            align: 'right',
            baseline: 'bottom',
        })
        ctx.restore()
    }

    #emphasizeSample(sample, color = 'white') {
        const p = math.remapPoint(this.dataBounds, this.pixelBounds, sample.point)
        const grd = this.ctx.createRadialGradient(...p, 0, ...p, this.margin)
        grd.addColorStop(0, color)
        grd.addColorStop(1, 'rgba(255, 255, 255, 0)')
        graphics.drawPoint(this.ctx, p, grd, this.margin * 2)
        this.#drawSamples([sample])
    }

    selectSample(sample) {
        this.selectedSample = sample
        this.#draw()
    }

    #drawSamples(samples) {
        const { ctx, pixelBounds, dataBounds } = this
        for (const sample of samples) {
            const { point, label } = sample
            const pointLoc = math.remapPoint(dataBounds, pixelBounds, point)
            switch (this.icon) {
                case 'image':
                    graphics.drawImage(ctx, this.styles[label].image, pointLoc)
                    break
                case 'text':
                    graphics.drawText(ctx, {
                        text: this.styles[label].text,
                        loc: pointLoc,
                        size: 20,
                    })
                    break
                default:
                    graphics.drawPoint(
                        ctx,
                        pointLoc,
                        this.styles[label].color,
                    )
            }
        }
    }

    showDynamicPoint(point, label, nearestSamples) {
        this.dynamicPoint = { point, label }
        this.nearestSamples = nearestSamples
        this.#draw()
    }

    hideDynamicPoint() {
        this.dynamicPoint = null
        this.#draw()
    }
}