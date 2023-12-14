class SketchPad {
  constructor(container, onUpdate, size = 400) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = size
    this.canvas.height = size
    this.ctx = this.canvas.getContext('2d')
    this.canvas.style = `
      background-color: white;
      box-shadow: 0 0 10px 2px black;
    `
    container.appendChild(this.canvas)

    this.lineBreak = document.createElement('br')
    container.appendChild(this.lineBreak)
    
    this.#setupControls()
    // paths is an array of path
    // path is an array of points
    this.paths = []
    this.onUpdate = onUpdate

    this.#addEventListeners()
    this.#draw()
  }

  #setupControls() {
    this.undoBtn = document.createElement('button')
    this.undoBtn.innerHTML = 'Undo'
    container.appendChild(this.undoBtn)

  }

  #addEventListeners() {
    let down = e => {
      const start = this.#getMousePosition(e)
      this.paths.push([start])
    }

    let move = e => {
      const mouse = this.#getMousePosition(e)
      const curPath = this.paths[this.paths.length - 1]
      curPath.push(mouse)
      this.#draw()
    }

    this.canvas.addEventListener('mousedown', e => {
      down(e)

      let up = () => {
        document.removeEventListener('mousemove', move)
        document.removeEventListener('mousedown', up)
      }

      document.addEventListener('mousemove', move)
      document.addEventListener('mouseup', up)
    })

    // add touch event on canvas
    this.canvas.addEventListener('touchstart', e => {
      down(e.touches[0])

      let touchmove = e => move(e.touches[0])
      
      let up = () => {
        document.removeEventListener('touchmove', touchmove)
        document.removeEventListener('touchend', up)
      }

      document.addEventListener('touchmove', touchmove)
      document.addEventListener('touchend', up)
    })

    this.undoBtn.addEventListener('click', () => {
      this.paths.pop()
      this.#draw()
    })
  }

  reset() {
    this.paths = []
    this.#draw()
  }

  triggerUpdate() {
    if (this.onUpdate) this.onUpdate(this.paths)
  }

  #draw() {
    this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height)

    draw.paths(this.ctx, this.paths)

    if (this.paths.length > 0) {
      this.undoBtn.disabled = false
    } else {
      this.undoBtn.disabled = true
    }
    this.triggerUpdate()
  }

  #getMousePosition({ clientX, clientY }) {
    const rect = this.canvas.getBoundingClientRect()
    return [
      Math.round(clientX - rect.left), 
      Math.round(clientY - rect.top)
    ] 
  }

}
