const { log } = require('console')
const constants = require('../common/constants')
const features = require('../common/features')
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
    sample.point = [
        features.pathCount(paths),
        features.pointsCount(paths),
    ]
}

const featureNames = [
    'pathCount',
    'pointsCount',
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

log('Done.')