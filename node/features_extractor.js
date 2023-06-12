const { log } = require('console')
const constants = require('../common/constants')
const featureFunctions = require('../common/features')
const utils = require('../common/utils')
const fs = require('fs')
const path = require('path')

log('Extracting features...')
const samples = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, constants.SAMPLES))
)


for (const sample of samples) {
    const paths = JSON.parse(
        fs.readFileSync(path.resolve(__dirname, constants.JSON_DIR + '/' + sample.id + '.json'))
    )
    
    sample.point = featureFunctions.inUse.map(({ func }) => func(paths))
}

const minMax = utils.normalizePoints(
    samples.map(s => s.point),
)

const featureNames = [
    'Width',
    'Height',
]

fs.writeFileSync(path.resolve(__dirname, constants.FEATURES), JSON.stringify(
    {
        featureNames,
        samples,
    },
    null,
    2
))

fs.writeFileSync(path.resolve(__dirname, constants.FEATURES_JS),
    `const features = ${JSON.stringify(
        {
            featureNames,
            samples,
        },
        null,
        2
    )}`
)

fs.writeFileSync(path.resolve(__dirname, constants.MIN_MAX_JS),
    `const minMax = ${JSON.stringify(
        minMax,
        null,
        2
    )}`
)

log('Done.')