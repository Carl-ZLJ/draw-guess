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
        sampleContainer.classList.add('sample-container')
        row.appendChild(sampleContainer)

        const img = document.createElement('img')
        img.src = `${constants.IMG_DIR}/${sample.id}.png`
        img.classList.add('thumbnail')
        sampleContainer.appendChild(img)

        const label = document.createElement('span')
        label.classList.add('label')
        label.innerText = sample.label
        sampleContainer.appendChild(label)
    }
}