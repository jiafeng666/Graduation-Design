const express = require('express')
const router = express.Router()

const AnjukeExtractor = require('./anjuke/AnjukeZufang')  // 安居客

const BeiKeNewHouseExtractor = require('./beike/beike_xinfang')  // 贝壳

const LianJiaNewHouseExtractor = require('./lianjia/lianjia_xinfang')  // 链家

const Five8NewHouseExtractor = require('./58tongcheng/58_xinfang')  // 58同城

/**安居客 */
router.get('/anjuke', (req, res) => {
    var url = req.query.key    // 房源url: https://gz.zu.anjuke.com/fangyuan/2419580265847821
    var anjuke = new AnjukeExtractor()
    anjuke.crawlItem(url).then( data => {
        res.send(data)
    })
})

/**贝壳 */
router.get('/beike', (req, res) => {
    var city = req.query.key     // 城市名每个字拼音首字母
    var page = req.query.page
    var beike = new BeiKeNewHouseExtractor()
    beike.crawlList(city, page).then( data => {
        res.send(data)
    })
})

/**链家 */
router.get('/lianjia', (req, res) => {
    var city = req.query.key     // 城市名每个字拼音首字母
    var page = req.query.page
    var lianjia = new LianJiaNewHouseExtractor()
    lianjia.crawlList(city, page).then( data => {
        res.send(data)
    })
})

/**58同城 */
router.get('/58', (req, res) => {
    var city = req.query.key     // 城市名每个字拼音首字母
    var page = req.query.page
    var five = new Five8NewHouseExtractor()
    five.crawlList(city, page).then( data => {
        res.send(data)
    })
})

module.exports = router