function createRow(container, username, samples) {
    const row = document.createElement('div')
    row.classList.add('row')
    container.appendChild(row)

    const rowLabel = document.createElement('div')
    rowLabel.classList.add('row-label')
    rowLabel.innerText = username
    row.appendChild(rowLabel)

    for (let sample of samples) {
        const sampleContainer = document.createElement('div')
        sampleContainer.id = `sample_${sample.id}`
        sampleContainer.onclick = (e) => {
            if (e.ctrlKey) {
                toggleFlaggedSample(sample)
            } else {
                handleClick(sample, false)
            }
        }
        sampleContainer.classList.add('sample-container')
        if (sample.correct) {
            sampleContainer.style.backgroundColor = 'lightgreen'
        }

        const sampleLabel = document.createElement('div')
        sampleLabel.innerHTML = sample.label
        sampleContainer.appendChild(sampleLabel)

        const img = document.createElement('img')
        img.src = `${constants.IMG_DIR}/${sample.id}.png`
        img.classList.add('thumbnail')
        sampleContainer.appendChild(img)

        row.appendChild(sampleContainer)
    }
}

function handleClick(sample, scroll = true) {
    if (sample == null) {
        [...document.querySelectorAll('.sample-container.emphasis')]
            .forEach(container => container.classList.remove('emphasis'))
        return
    }

    const container = document.getElementById(`sample_${sample.id}`)

    if (container.classList.contains('emphasis')) {
        container.classList.remove('emphasis')
        chart.selectSample(null)
        return
    }

    [...document.querySelectorAll('.sample-container.emphasis')]
        .forEach(container => container.classList.remove('emphasis'))

    container.classList.add('emphasis')

    if (scroll) {
        container.scrollIntoView({ behavior: 'auto', block: 'center' })
    }

    chart.selectSample(sample)
}

function togglePad() {
    if (inputContainer.style.display == 'none') {
        inputContainer.style.display = 'block'
        sketchPad.triggerUpdate()
    } else {
        inputContainer.style.display = 'none'
        chart.hideDynamicPoint()
    }
}

function toggleOutput() {
    if (networkCanvas.style.display == '') {
        networkCanvas.style.display = 'none'
        confusionContainer.style.display = ''
    } else if (confusionContainer.style.display == '') {
        confusionContainer.style.display = 'none'
    } else {
        confusionContainer.style.display = ''
        networkCanvas.style.display = ''
    }
}