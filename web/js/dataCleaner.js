const flaggedSamples = []

function toggleFlaggedSample(sample) {
    const i = flaggedSamples.indexOf(sample.id)
    if (i == -1) {
        flaggedSamples.push(sample.id)
    } else {
        flaggedSamples.splice(i, 1)
    }

    [...document.querySelectorAll('.flagged')].forEach((el) =>
        el.classList.remove('flagged')
    )

    for (const id of flaggedSamples) {
        const el = document.querySelector(`#sample_${id}`)
        el.classList.add('flagged')
    }
}
