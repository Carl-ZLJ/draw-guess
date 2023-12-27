const { log } = require('console')
const constants = require('../common/constants')
const featureFunctions = require('../common/features')
const utils = require('../common/utils')
const fs = require('fs')

log('Extracting features...')
const samples = JSON.parse(
    fs.readFileSync((__dirname, constants.SAMPLES))
)


for (const sample of samples) {
    const paths = JSON.parse(
        fs.readFileSync((__dirname, constants.JSON_DIR + '/' + sample.id + '.json'))
    )
    
    sample.point = featureFunctions.inUse.map(({ func }) => func(paths))
}

const featureNames = [
    'Width',
    'Height',
]

log('GENERATING SPLITS ...')

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

fs.writeFileSync((__dirname, constants.TRAINING), 
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

fs.writeFileSync(
    (__dirname, constants.TRAINING_CSV),
    utils.toCSV([...featureNames, 'Lable'], training.map(t => [...t.point, t.label]))
)

fs.writeFileSync((__dirname, constants.TRAINING_JS),
    `const training = ${JSON.stringify(
        {
            featureNames,
            samples: training,
        },
        null,
        2
    )}`
)

fs.writeFileSync((__dirname, constants.TESTING), 
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

fs.writeFileSync(
    (__dirname, constants.TESTING_CSV),
    utils.toCSV([...featureNames, 'Lable'], testing.map(t => [...t.point, t.label]))
)

fs.writeFileSync((__dirname, constants.TESTING_JS),
    `const testing = ${JSON.stringify(
        {
            featureNames,
            samples: testing,
        },
        null,
        2
    )}`
)

fs.writeFileSync((__dirname, constants.FEATURES), JSON.stringify(
    {
        featureNames,
        samples,
    },
    null,
    2
))

fs.writeFileSync((__dirname, constants.FEATURES_JS),
    `const features = ${JSON.stringify(
        {
            featureNames,
            samples,
        },
        null,
        2
    )}`
)

fs.writeFileSync((__dirname, constants.MIN_MAX_JS),
    `const minMax = ${JSON.stringify(
        minMax,
        null,
        2
    )}`
)

log('Done.')