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
                source = replacePlaceholder(source, key, placeholders[key])
            }
        }
    }
    return source
}

const replacePlaceholder = (source, placeholder, value) => {
    var regEx = new RegExp(`{{${placeholder}}}`, 'ig')
    if (source.match(regEx)) {
        source = source.replace(regEx, value)
    }
    return source
}

const replaceDateImpl = (source) => {
    // Replace NOW
    while (match = source.match(/{{NOW([\+,-])?(\d)?([h,H,m,M,s,S])?=?([^}]*)?}}/i)) {
        source = replaceRegExp(source, match, timeUnits, 'h', 'YYYY-MM-DDTHH:mm:ss')
    }

    // Replace TODAY
    while (match = source.match(/{{TODAY([\+,-])?(\d)?([d,D,m,M,y,Y,w,W])?=?([^}]*)?}}/i)) {
        source = replaceRegExp(source, match, dateUnits, 'd', 'YYYY-MM-DD')
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
