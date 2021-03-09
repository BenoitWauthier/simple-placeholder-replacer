const assert = require('assert');
const placeholderReplacer = require("../src/index.js")
const timekeeper = require('timekeeper')
const moment = require('moment')

describe('placeholderReplacer tests', function () {
    const freezedDate = new Date()
    timekeeper.freeze(freezedDate)

    try {
        it('Replkace NOW placeholder', function () {
            assert.strictEqual(placeholderReplacer('key1: {{NOW=hh:mm:ss}}, key2: {{NOW}}'), `key1: ${calcMoment(0, 'd', 'hh:mm:ss')}, key2: ${calcMoment(0, 'd', 'YYYY-MM-DDTHH:mm:ss')}`)
            assert.strictEqual(placeholderReplacer('key: {{now}}'), `key: ${calcMoment(0, 'd', 'YYYY-MM-DDTHH:mm:ss')}`)
            assert.deepStrictEqual(placeholderReplacer(JSON.parse('{"key": "{{NOW}}"}')), { key: calcMoment(0, 'd', 'YYYY-MM-DDTHH:mm:ss') })
        })

        it('Replkace TODAY placeholder', function () {
            assert.strictEqual(placeholderReplacer('key1: {{TODAY}}, key2: {{TODAY=DD MM YYYY}}'), `key1: ${calcMoment()}, key2: ${calcMoment(0, 'd', 'DD MM YYYY')}`)
            assert.strictEqual(placeholderReplacer('key: {{today}}'), `key: ${calcMoment(0, 'd', 'YYYY-MM-DD')}`)
            assert.deepStrictEqual(placeholderReplacer(JSON.parse('{"key": "{{TODAY}}"}')), { key: calcMoment(0, 'd', 'YYYY-MM-DD') })
        })

        it('Replkace TODAY+xxx placeholder', function () {
            assert.strictEqual(placeholderReplacer('key1: {{TODAY+1}}, key2: {{TODAY+2=DD MM YYYY}}'), `key1: ${calcMoment(1, 'd', 'YYYY-MM-DD')}, key2: ${calcMoment(2, 'd', 'DD MM YYYY')}`)
            assert.strictEqual(placeholderReplacer('key: {{today+1}}'), `key: ${calcMoment(1, 'd', 'YYYY-MM-DD')}`)
            assert.strictEqual(placeholderReplacer('key: {{today+1M=DD MM YYYY}}'), `key: ${calcMoment(1, 'month', 'DD MM YYYY')}`)
            assert.deepStrictEqual(placeholderReplacer(JSON.parse('{"key": "{{TODAY+1}}"}')), { key: calcMoment(1, 'd', 'YYYY-MM-DD') })
        })

        it('Replkace TODAY-xxx placeholder', function () {
            assert.strictEqual(placeholderReplacer('key1: {{TODAY-1}}, key2: {{TODAY-2=DD MM YYYY}}'), `key1: ${calcMoment(-1, 'd', 'YYYY-MM-DD')}, key2: ${calcMoment(-2, 'd', 'DD MM YYYY')}`)
            assert.strictEqual(placeholderReplacer('key: {{today-1}}'), `key: ${calcMoment(-1, 'd', 'YYYY-MM-DD')}`)
            assert.deepStrictEqual(placeholderReplacer(JSON.parse('{"key": "{{TODAY-1}}"}')), { key: calcMoment(-1, 'd', 'YYYY-MM-DD') })
        })

        it('Replkace custom placeholder', function () {
            const placeholders = {
                ph1: "first",
                ph2: "second"
            }
            assert.strictEqual(placeholderReplacer('key1: {{ph1}}, key2: {{PH2}}', placeholders), 'key1: first, key2: second')
            assert.deepStrictEqual(placeholderReplacer(JSON.parse('{"key1": "{{ph1}}", "key2": "{{PH2}}"}'), placeholders), { key1: "first", key2: "second" })
        })

        const calcMoment = (number = 0, unit = 'd', format = 'YYYY-MM-DD') => {
            return moment().add(number, unit).format(format)
        }
    } finally {
        timekeeper.reset()
    }
})