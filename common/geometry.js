const geometry = Object.create(null)

/**
 * for all functions below, assume screen coordinates: the x-axis is rightward, 
 * the y-axis is downward 
 */


/**
 * 
 * @param {[[number, number]]} points 
 * @returns {[number, number]} a point which has the maximum y value and 
 * the leftmost x value
 */
geometry.lowestPoint = (points) => points.reduce((lowest, point) => {
    if (point[1] > lowest[1]) return point
    if (point[1] === lowest[1] && point[0] < lowest[0]) return point
    return lowest
})


/**
 * @description sort points in couter-clockwise order relative to given origin
 * @param {[number, number]} origin 
 * @param {[[number, number]]} points 
 * @returns sorted points
 */
geometry.sortPoints = (origin, points) => points.slice().sort((a, b) => {
    const orientation = calcOrientation(origin, a, b)
    if (orientation == 0) {
        // choose the closer one
        return distance(origin, a) - distance(origin, b)
    }
    return orientation
})


/**
 * @description build a convex hull using Graham Scan Algorithm
 * @param {[[number, number]]} points 
 */
geometry.grahamScan = (points) => {
    const lowestPoint = geometry.lowestPoint(points)
    const sortedPoints = geometry.sortPoints(lowestPoint, points)

    const stack = [sortedPoints[0], sortedPoints[1], sortedPoints[2]]

    for(let i = 3; i < sortedPoints.length; i++) {
        let top = stack.length - 1
        // last two points in stack calc with new point first, if causes a concav(meaning calcOrientation is 1 or 0), 
        // pop the last point, continue with the new last two points
        // until adding a new point won't cause concav, push to the stack
        // after the loop is finished, the result polygon will be convex
        while(top > 0 && calcOrientation(stack[top - 1], stack[top], sortedPoints[i]) >= 0) {
            stack.pop()
            top--
        }

        stack.push(sortedPoints[i])
    }

    return stack
}

/**
 * @description Use two hull's points as an edge of the bounding box to calc the coincident rectangle
 * @param {[[number, number]]} hull 
 * @param {number} i 
 * @param {number} j 
 */
geometry.coincidentBox = (hull, i, j) => {
    const diff = (a, b) => [a[0] - b[0], a[1] - b[1]]
    const dot = (a, b) => a[0] * b[0] + a[1] * b[1]
    const len = a => (a[0] **2 + a[1]** 2) ** 0.5
    const add = (a, b) => [a[0] + b[0], a[1] + b[1]]
    const multi = (a, n) => [a[0] * n, a[1] * n]
    const div  = (a, n) => [a[0] / n, a[1] / n]
    const unit = div(a, len(a))
 
    // use i-j as an edge
    let origin = hull[i]
    let baseX = unit(diff(hull[j], origin))
    let baseY = [baseX[1], -baseX[0]]

    let left = 0
    let right = 0
    let top = 0
    let bottom = 0

    for(let p of hull) {
        const n = diff(p, origin)
        // n project to new coordinates
        const v = [dot(baseX, n), dot(baseY, n)]
        // calculate bounding box border
        left = Math.min(left, v[0])
        right = Math.max(right, v[0])
        top = Math.min(top, v[1])
        bottom = Math.max(bottom, v[1])
    }

    // convert back to original coordinates
    const vertices = [
        add(add(multi(baseX, left), multi(baseY, top)), origin),
        add(add(multi(baseX, left), multi(baseY, bottom)), origin),
        add(add(multi(baseX, right), multi(baseY, top)), origin),
        add(add(multi(baseX, right), multi(baseY, bottom)), origin),
    ]

    return {
        vertices,
        width: right - left,
        height: bottom - top,
    }
}

/**
 * @description Choose a bounding box which the area is the minimum
 * @param {Object} object 
 * @param {[[number, number]]} object.points
 * @param {[[number, number]]} object.hull
 * @returns 
 */
geometry.minimumBoundingBox = ({points, hull}) => {
    hull = hull || geometry.grahamScan(points)

    let minArea = Number.MAX_VALUE
    let result = null
    for(let i = 0; i < hull.length; i++) {
        const { vertices, width, height } = geometry.coincidentBox(hull, i, (i + 1) % hull.length)
        const area = width * height
        if (area < minArea) {
            minArea = area
            result = {
                vertices,
                width,
                height,
            }
        }
    }
    return result
}


/**
 * @description Find out whether p2 is on the left or the right side of op1
 * by calculating cross-production of op1 and op2
 * in our coordinates, when cross-production is
 * negative, p2 is on the right side,
 * position, p2 is on the left side,
 * 0, p2 is on the line
 * @param {[number, number]} origin 
 * @param {[number, number]} p1 
 * @param {[number, number]} p2 
 * @returns {number} right = 1, left = -1, same line = 0
 */
function calcOrientation(origin, p1, p2) {
    const OP1 = [p1[0] - origin[0], p1[1] - origin[1]]
    const OP2 = [p2[0] - origin[0], p2[1] - origin[1]]
    const crossProduct = OP1[0] * OP2[1] - OP1[1] * OP2[0]
    if (crossProduct == 0) return 0
    return crossProduct > 0 ? 1 : -1
}


/**
 * @description Squared distance between a and b
 * @param {[number, number]} a 
 * @param {[number, number]} b
 * @returns {number}
 */
function distance(a, b) {
    return (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = geometry
}