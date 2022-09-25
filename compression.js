let MatchBase = " etaoinsr hdlucmfyw gpbvkxqjz"
exports.CompressUInt = (n, cp) => {
    if (typeof cp == "string") cp = [...cp];
    let p = [0];
    let pos = 0;
    for (let i = 0; i < n; i++) {
        p[0]++
        while (p.includes(cp.length)) {
            for (j = 0; j < p.length; j++) {
                if (p[j] == cp.length) {
                    p[j] = 0;
                    p[j + 1] = !p[j + 1] ? 1 : p[j + 1] + 1
                }

            }
        }
    }
    let out = ""
    for (let i in p.reverse()) {
        out += (cp[p[i]])
    }
    return out
}
exports.DecompressUInt = (n, cp) => {
    n = [...n];
    n.reverse();
    let total = 0;
    for (i = 0; i < n.length; i++) {
        total += ((cp.length ** i) * cp.indexOf(n[i]))
    }
    return total;
}

exports.CompressString = (str, cp) => {
    let cstr = '';
    for (i=0;i<str.length;i++) {
        cstr += ('0' + MatchBase.indexOf(str[i])).slice(-2)
        
    }
    
    let currentnum = '';
    cstr = [...cstr];
    for (i in cstr) {
        if(isNaN(+cstr[i])) return "Compression Error"
        cstr[i] = +cstr[i] + 1

    }
    let ostr = '';
    let pos = 0;
    for (;;) {
        
        do {
            if (!cstr[0] || +(currentnum + cstr[0]) > cp.length || currentnum.length == 3) break;
            currentnum += cstr.shift();
        } while (+currentnum < cp.length);
        ostr += cp[+currentnum]

        currentnum = '';
        if (cstr.length < 1) break;
    }
    return ostr;
}

exports.DecompressString = (str, cp) => {
    let nstr = '';
    for (i = 0; i < str.length; i++) {
        let char = cp.indexOf(str[i])
        nstr += (char)
    }
    nstr = [...nstr]
    for (i in nstr) {
        nstr[i] = +nstr[i] - 1
    }
    nstr = nstr.join``

    let out = ''
    for (i = 0; i < nstr.length; i += 2) {
        out += (
            MatchBase[
            +(nstr[i] + nstr[i + 1])
            ]
        )
    }
    return out;

}