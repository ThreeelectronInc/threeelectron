function lerp (a,  b,  c) {
    c = c < 0 ? 0 : c
    c = c > 1 ? 1 : c
    return a + c * (b - a);
}

function unclamped_lerp (a,  b,  c) {
    return a + c * (b - a);
}

module.exports = {
    lerp: lerp,
    unclamped_lerp: unclamped_lerp
}