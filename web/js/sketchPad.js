class SketchPad {
  constructor(container, onUpdate, size = 400) {
    this.canvas = document.createElement('canvas')
    this.canvas.width = size
    this.canvas.height = size
    this.canvas.style = `
      background-color: white;
      box-shadow: 0 0 10px 2px black;
    `
    container.appendChild(this.canvas)
    this.onUpdate = onUpdate
    this.lineBreak = document.createElement('br')
    container.appendChild(this.lineBreak)

    this.undoBtn = document.createElement('button')
    this.undoBtn.innerHTML = 'Undo'
    container.appendChild(this.undoBtn)

    this.ctx = this.canvas.getContext('2d')
  
    // array of path
    this.paths = []

    this.#addEventListeners()
    this.#redraw()
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
      this.#redraw()
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
      this.#redraw()
    })
  }

  reset() {
    this.paths = []
    this.#redraw()
  }

  triggerUpdate() {
    if (this.onUpdate) this.onUpdate(this.paths)
  }

  #redraw() {
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
