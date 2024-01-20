class Confusion {
    constructor(container, samples, classes, options) {
        this.container = container
        this.samples = samples
        this.classes = classes
        this.size = options.size
        this.styles = options.styles

        this.N = classes.length + 1
        this.cellSize = this.size / (this.N + 1)

        this.table = this.#createTable()
        container.appendChild(this.table)

        const topText = this.#creatTopText()
        container.appendChild(topText)

        const leftText = this.#creatLeftText()
        container.appendChild(leftText)

        this.matrix = this.#prepareMatrix(samples)
        this.#fillTable()
    }

    #creatTopText() {
        const text = document.createElement('div')
        text.innerHTML = 'Predicted Class'
        text.style.fontSize = 'x-large'
        text.style.position = 'absolute'
        text.style.top = '0'
        text.style.left = '50%'
        text.style.transform = 'translate(-50%)'
        text.style.height = this.cellSize + 'px'
        text.style.textAlign = 'center'
        text.style.display = 'flex'
        text.style.alignItems = 'center'
        text.style.marginInline = this.cellSize / 2 + 'px'
        return text
    }

    #creatLeftText() {
        const text = document.createElement('div')
        text.innerHTML = 'True Class'
        text.style.fontSize = 'x-large'
        text.style.position = 'absolute'
        text.style.left = '0'
        text.style.top = '50%'
        text.style.transform = 'translate(-50%) rotate(-90deg)'
        text.style.height = this.cellSize + 'px'
        text.style.textAlign = 'center'
        text.style.display = 'flex'
        text.style.alignItems = 'center'
        text.style.marginInline = this.cellSize / 2 + 'px'
        return text
    }

    #createTable() {
        const table = document.createElement('table')
        table.style.borderCollapse = 'collapse'
        table.style.textAlign = 'center'
        table.style.marginTop = this.cellSize + 'px'
        table.style.marginLeft = this.cellSize + 'px'

        return table
    }

    #prepareMatrix(samples) {
        const matrix = []
        for (let i = 0; i < this.N; i++) {
            matrix[i] = []
            for (let j = 0; j < this.N; j++) {
                matrix[i][j] = 0
            }
        }

        for (const s of samples) {
            matrix[this.classes.indexOf(s.truth) + 1]
            [this.classes.indexOf(s.label) + 1]++;
        }

        for (let i = 1; i < this.N; i++) {
            for (let j = 0; j < this.N; j++) {
                matrix[0][j] += matrix[i][j]
                matrix[i][0] += matrix[i][j]
            }
        }

        for (let i = 1; i < this.N; i++) {
            matrix[0][i] -= matrix[i][0]
            if (matrix[0][i] > 0) {
                matrix[0][i] = `+${matrix[0][i]}`
            }
        }

        matrix[0][0] = ''
        return matrix
    }

    #fillTable() {
        const { N, table, cellSize, matrix } = this

        const values = matrix
            .slice(1)
            .map(a => a.slice(1))
            .flat()

        const max = Math.max(...values)
        const min = Math.min(...values)

        for (let i = 0; i < N; i++) {
            const row = document.createElement('tr')
            table.appendChild(row)

            for (let j = 0; j < N; j++) {
                const cell = document.createElement('td')
                // Todo: delete after testing
                cell.style.border = '1px solid red'
                cell.style.width = cellSize + 'px'
                cell.style.height = cellSize + 'px'
                cell.style.padding = '0'
                cell.textContent = matrix[i][j]

                if (i == 0 && j > 0) {
                    cell.style.backgroundImage =
                        `url(${this.styles[this.classes[j - 1]].image.src})`
                    cell.style.backgroundRepeat = 'no-repeat'
                    cell.style.backgroundPosition = '50% 30%'
                    cell.style.verticalAlign = 'bottom'
                    cell.style.fontWeight = 'bold'
                    const p = matrix[i][j] / matrix[j][i] * 2
                    const R = p >= 0 ? p * 255 : 0
                    const B = p < 0 ? -p * 255 : 0
                    cell.style.color = `rgb(${R}, 0, ${B})`
                }

                if (j == 0 && i > 0) {
                    cell.style.backgroundImage =
                        `url(${this.styles[this.classes[i - 1]].image.src})`
                    cell.style.backgroundRepeat = 'no-repeat'
                    cell.style.backgroundPosition = '50% 30%'
                    cell.style.verticalAlign = 'bottom'
                    cell.style.fontWeight = 'bold'
                }

                if (i > 0 && j > 0) {
                    const p = math.inverseLerp(min, max, matrix[i][j])
                    if (i == j) {
                        cell.style.backgroundColor = `rgba(0, 0, 255, ${p})`
                    } else {
                        cell.style.backgroundColor = `rgba(255, 0, 0, ${p})`
                    }
                }

                row.appendChild(cell)
            }
        }
    }
}
