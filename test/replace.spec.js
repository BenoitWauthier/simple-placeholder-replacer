const assert = require('assert');
const replace = require("../src/index.js")
const timekeeper = require('timekeeper')
const moment = require('moment')

describe('placeholderReplacer tests', function () {
    const freezedDate = new Date()
    timekeeper.freeze(freezedDate)

    try {
        it('Replace undefined / null input', function () {
            assert.strictEqual(typeof(replace(undefined)), "undefined")
            assert.strictEqual(replace(null), null)
        })

        it('Replace NOW placeholder', function () {
            assertReplace('{"key1": "{{NOW=hh:mm:ss}}", "key2": "{{NOW}}"}', `{"key1": "${calcMoment(0, 'd', 'hh:mm:ss')}", "key2": "${calcMoment(0, 'd', 'YYYY-MM-DDTHH:mm:ss')}"}`)
            assertReplace('{"key": "{{now}}"}', `{"key": "${calcMoment(0, 'd', 'YYYY-MM-DDTHH:mm:ss')}"}`)
        })

        it('Replkce TODAY placeholder', function () {
            assertReplace('{"key1": "{{TODAY}}", "key2": "{{TODAY=DD MM YYYY}}"}', `{"key1": "${calcMoment()}", "key2": "${calcMoment(0, 'd', 'DD MM YYYY')}"}`)
            assertReplace('{"key": "{{today}}"}', `{"key": "${calcMoment(0, 'd', 'YYYY-MM-DD')}"}`)
        })

        it('Replace TODAY+xxx placeholder', function () {
            assertReplace('{"key1": "{{TODAY+1}}", "key2": "{{TODAY+2=DD MM YYYY}}"}', `{"key1": "${calcMoment(1, 'd', 'YYYY-MM-DD')}", "key2": "${calcMoment(2, 'd', 'DD MM YYYY')}"}`)
            assertReplace('{"key": "{{today+1}}"}', `{"key": "${calcMoment(1, 'd', 'YYYY-MM-DD')}"}`)
            assertReplace('{"key": "{{today+1M=DD MM YYYY}}"}', `{"key": "${calcMoment(1, 'month', 'DD MM YYYY')}"}`)
        })

        it('Replace TODAY-xxx placeholder', function () {
            assertReplace('{"key": "{{TODAY-1}}"}', `{"key": "${calcMoment(-1, 'd', 'YYYY-MM-DD')}"}`)
            assertReplace('{"key": "{{TODAY-1M}}"}', `{"key": "${calcMoment(-1, 'month', 'YYYY-MM-DD')}"}`)
            assertReplace('{"key1": "{{TODAY-1}}", "key2": "{{TODAY-2=DD MM YYYY}}"}', `{"key1": "${calcMoment(-1, 'd', 'YYYY-MM-DD')}", "key2": "${calcMoment(-2, 'd', 'DD MM YYYY')}"}`)
        })

        it('Replace custom placeholder', function () {
            var ph3
            const placeholders = {
                ph1: "first",
                ph2: "second",
                ph3
            }
            assertReplace('{"key1": "{{ph1}}", "key2": "{{PH2}}"}', '{"key1": "first", "key2": "second"}', placeholders)
        })

        const assertReplace = (source, expected, placeholders) => {
            assert.strictEqual(replace(source, placeholders), expected)
            assert.deepStrictEqual(replace(JSON.parse(source), placeholders), JSON.parse(expected))
        }

        const calcMoment = (number = 0, unit = 'd', format = 'YYYY-MM-DD') => {
            return moment().add(number, unit).format(format)
        }
    } finally {
        timekeeper.reset()
    }
})