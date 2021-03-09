const assert = require('assert');
const replace = require("../src/index.js")
const timekeeper = require('timekeeper')
const moment = require('moment')

describe('placeholderReplacer tests', function () {
    const freezedDate = new Date()
    timekeeper.freeze(freezedDate)

    try {
        it('Replace NOW placeholder', function () {
            assert.strictEqual(replace('key1: {{NOW=hh:mm:ss}}, key2: {{NOW}}'), `key1: ${calcMoment(0, 'd', 'hh:mm:ss')}, key2: ${calcMoment(0, 'd', 'YYYY-MM-DDTHH:mm:ss')}`)
            assert.strictEqual(replace('key: {{now}}'), `key: ${calcMoment(0, 'd', 'YYYY-MM-DDTHH:mm:ss')}`)
            assert.deepStrictEqual(replace(JSON.parse('{"key": "{{NOW}}"}')), { key: calcMoment(0, 'd', 'YYYY-MM-DDTHH:mm:ss') })
        })

        it('Replkce TODAY placeholder', function () {
            assert.strictEqual(replace('key1: {{TODAY}}, key2: {{TODAY=DD MM YYYY}}'), `key1: ${calcMoment()}, key2: ${calcMoment(0, 'd', 'DD MM YYYY')}`)
            assert.strictEqual(replace('key: {{today}}'), `key: ${calcMoment(0, 'd', 'YYYY-MM-DD')}`)
            assert.deepStrictEqual(replace(JSON.parse('{"key": "{{TODAY}}"}')), { key: calcMoment(0, 'd', 'YYYY-MM-DD') })
        })

        it('Replace TODAY+xxx placeholder', function () {
            assert.strictEqual(replace('key1: {{TODAY+1}}, key2: {{TODAY+2=DD MM YYYY}}'), `key1: ${calcMoment(1, 'd', 'YYYY-MM-DD')}, key2: ${calcMoment(2, 'd', 'DD MM YYYY')}`)
            assert.strictEqual(replace('key: {{today+1}}'), `key: ${calcMoment(1, 'd', 'YYYY-MM-DD')}`)
            assert.strictEqual(replace('key: {{today+1M=DD MM YYYY}}'), `key: ${calcMoment(1, 'month', 'DD MM YYYY')}`)
            assert.deepStrictEqual(replace(JSON.parse('{"key": "{{TODAY+1}}"}')), { key: calcMoment(1, 'd', 'YYYY-MM-DD') })
        })

        it('Replace TODAY-xxx placeholder', function () {
            assert.strictEqual(replace('key1: {{TODAY-1}}, key2: {{TODAY-2=DD MM YYYY}}'), `key1: ${calcMoment(-1, 'd', 'YYYY-MM-DD')}, key2: ${calcMoment(-2, 'd', 'DD MM YYYY')}`)
            assert.strictEqual(replace('key: {{today-1}}'), `key: ${calcMoment(-1, 'd', 'YYYY-MM-DD')}`)
            assert.deepStrictEqual(replace(JSON.parse('{"key": "{{TODAY-1}}"}')), { key: calcMoment(-1, 'd', 'YYYY-MM-DD') })
        })

        it('Replace custom placeholder', function () {
            const placeholdersMapping = {
                ph1: "first",
                ph2: "second"
            }
            assert.strictEqual(replace('key1: {{ph1}}, key2: {{PH2}}', placeholdersMapping), 'key1: first, key2: second')
            assert.deepStrictEqual(replace(JSON.parse('{"key1": "{{ph1}}", "key2": "{{PH2}}"}'), placeholdersMapping), { key1: "first", key2: "second" })
        })

        const calcMoment = (number = 0, unit = 'd', format = 'YYYY-MM-DD') => {
            return moment().add(number, unit).format(format)
        }
    } finally {
        timekeeper.reset()
    }
})