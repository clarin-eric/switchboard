export function keys(o) {
    const a = [];
    for (const x in o) {
        if (o.hasOwnProperty(x)) {
            a.push(x);
        }
    }
    return a;
}

export function toPairs(o) {
    var a = []
    for (var k in o) {
        if (o.hasOwnProperty(k)) {
            a.push([k, o[k]]);
        }
    }
    return a;
}
