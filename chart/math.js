const math = {}

math.lerp = (a, b, t) => {
    return a + (b - a) * t
}

math.inverseLerp = (a, b, v) => {
    return (v - a) / (b - a)
}

math.remap = (oldA, oldB, newA, newB, v) => {
    return math.lerp(newA, newB, math.inverseLerp(oldA, oldB, v))
}

math.remapPoint = (oldBounds, newBounds, point) => {
    return [
        math.remap(
            oldBounds.left, oldBounds.right,
            newBounds.left, newBounds.right,
            point[0]
        ),
        math.remap(
            oldBounds.top, oldBounds.bottom,
            newBounds.top, newBounds.bottom,
            point[1]
        ),
    ]
}

math.add = (a, b) => {
    return [
        a[0] + b[0],
        a[1] + b[1],
    ]
}

math.substract = (a, b) => {
    return [
        a[0] - b[0],
        a[1] - b[1],
    ]
}

math.equal = (a, b) => {
    return a[0] === b[0] && a[1] === b[1]
}

math.scale = (a, s) => {
    return [
        a[0] * s,
        a[1] * s,
    ]
}

math.distance = (a, b) => {
    return Math.sqrt(
        (b[1] - a[1]) ** 2 + (b[0] - a[0]) ** 2
    )
}

math.findNearest = (point, points) => {
    let minDist = Infinity
    let minIndex = -1
    for (let i = 0; i < points.length; i++) {
        const dist = math.distance(point, points[i])
        if (dist < minDist) {
            minDist = dist
            minIndex = i
        }
    }
    return minIndex
}