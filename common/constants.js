const constants = {}

// create dir constants 
constants.DATA_DIR = '../data'
constants.RAW_DIR = constants.DATA_DIR + '/raw'
constants.DATASET_DIR = constants.DATA_DIR + '/dataset'
constants.JSON_DIR = constants.DATASET_DIR + '/json'
constants.IMG_DIR = constants.DATASET_DIR + '/img'
constants.SAMPLES = constants.DATASET_DIR + '/samples.json'

constants.COMMON = '../common'
constants.JS_OBJECT = constants.COMMON + '/js_objects'
constants.SAMPLES_JS = constants.JS_OBJECT + '/sample.js'

if (typeof module !== 'undefined' && module.exports) {
    module.exports = constants
}