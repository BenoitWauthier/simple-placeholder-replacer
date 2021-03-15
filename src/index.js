const moment = require('moment')

const dateUnits = {
    d: 'day',
    m: 'month',
    y: 'year',
    w: 'week'
}

const timeUnits = {
    h: 'hour',
    m: 'minute',
    s: 'second'
}

const replace = (source, placeholders = {}) => {
    if (!source) return source

    if (typeof source === "object") {
        const stringifiedSource = JSON.stringify(source)
        return JSON.parse(replacePlaceholdersImpl(stringifiedSource, placeholders))
    }
    
    return replacePlaceholdersImpl(source, placeholders)
}

const replacePlaceholdersImpl = (source, placeholders) => {
    // Replace dates if any
    source = replaceDateImpl(source)

    // Replace other placeholders if any
    if (placeholders && Object.keys(placeholders).length > 0) {
        for (const key in placeholders) {
            if (placeholders[key] != null) {
                source = source.replace(new RegExp(`{{${key}}}`, 'ig'), placeholders[key])
            }
        }
    }

    return source
}

const replaceDateImpl = (source) => {
    
    // Replace NOW
    var match = source.match(/{{NOW([+,-])?(\d)?([h,H,m,M,s,S])?=?([^}]*)?}}/i)
    while (match) {
        source = replaceRegExp(source, match, timeUnits, 'h', 'YYYY-MM-DDTHH:mm:ss')
        match = source.match(/{{NOW([+,-])?(\d)?([h,H,m,M,s,S])?=?([^}]*)?}}/i)
    }

    // Replace TODAY
    match = source.match(/{{TODAY([+,-])?(\d)?([d,D,m,M,y,Y,w,W])?=?([^}]*)?}}/i)
    while (match) {
        source = replaceRegExp(source, match, dateUnits, 'd', 'YYYY-MM-DD')
        match = source.match(/{{TODAY([+,-])?(\d)?([d,D,m,M,y,Y,w,W])?=?([^}]*)?}}/i)
    }

    return source
}

const replaceRegExp = (source, match, units, defaultUnit, defaultFormat) => {
    let sign = 1
    if (match[1] && match[1] === '-') {
        sign = -1
    }
    let number = 0
    if (match[2]) {
        number = match[2]
    }
    let unit = defaultUnit
    if (match[3]) {
        unit = match[3]
    }
    let format = defaultFormat
    if (match[4]) {
        format = match[4]
    }
    const regEx = match[0].replace('+', '\\+').replace('-', '\\-')
    return source.replace(new RegExp(regEx, 'ig'), moment().add(sign * number, units[unit.toLowerCase()]).format(format))
}

module.exports = replace
