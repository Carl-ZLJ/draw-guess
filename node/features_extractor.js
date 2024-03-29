const constants = require('../common/constants')
const featureFunctions = require('../common/features')
const utils = require('../common/utils')
const fs = require('fs')
const { log } = require('console')
const { resolve } = require('./utils')

log('Extracting features...')
const samples = JSON.parse(
    fs.readFileSync(resolve(constants.SAMPLES))
)


for (let i = 0; i < samples.length; i++) {
    const sample = samples[i]
    const paths = JSON.parse(
        fs.readFileSync(resolve(constants.JSON_DIR + '/' + sample.id + '.json'))
    )

    sample.point = featureFunctions.inUse.map(({ func }) => func(paths))
    utils.printProgress(i + 1, samples.length)
}

const featureNames = [
    'Width',
    'Height',
    'Elongation',
    'Roundness',
]

log('\nGENERATING SPLITS ...')

const trainingAmount = samples.length * 0.5
const training = []
const testing = []
for (const s of samples) {
    if (training.length < trainingAmount) {
        training.push(s)
    } else {
        testing.push(s)
    }
}

const minMax = utils.normalizePoints(
    training.map(s => s.point),
)

utils.normalizePoints(
    testing.map(s => s.point),
    minMax,
)

fs.writeFileSync(resolve(constants.TRAINING),
    JSON.stringify(
        {
            featureNames,
            samples: training.map(t => ({
                label: t.label,
                point: t.point,
            })),
        },
        null,
        2
    )
)

fs.writeFileSync(resolve(constants.TRAINING_CSV),
    utils.toCSV([...featureNames, 'Label'], training.map(t => [...t.point, t.label]))
)

fs.writeFileSync(resolve(constants.TRAINING_JS),
    `const training = ${JSON.stringify(
        {
            featureNames,
            samples: training,
        },
        null,
        2
    )}`
)

fs.writeFileSync(resolve(constants.TESTING),
    JSON.stringify(
        {
            featureNames,
            samples: testing.map(t => ({
                label: t.label,
                point: t.point,
            })),
        },
        null,
        2
    )
)

fs.writeFileSync(resolve(constants.TESTING_CSV),
    utils.toCSV([...featureNames, 'Label'], testing.map(t => [...t.point, t.label]))
)

fs.writeFileSync(resolve(constants.TESTING_JS),
    `const testing = ${JSON.stringify(
        {
            featureNames,
            samples: testing,
        },
        null,
        2
    )}`
)

fs.writeFileSync(resolve(constants.FEATURES),
    JSON.stringify(
        {
            featureNames,
            samples,
        },
        null,
        2
    ))

fs.writeFileSync(resolve(constants.FEATURES_JS),
    `const features = ${JSON.stringify(
        {
            featureNames,
            samples,
        },
        null,
        2
    )}`
)

fs.writeFileSync(resolve(constants.MIN_MAX_JS),
    `const minMax = ${JSON.stringify(
        minMax,
        null,
        2
    )}`
)

log('Done.')
