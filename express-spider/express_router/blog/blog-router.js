const express = require('express')
const router = express.Router()

const WeiboHotSpider = require('./weibo/weibo_hotlist')    // 微博
const WeiboSearchSpider = require('./weibo/WeiboSearch')

const JuejinSpider = require('./juejin/juejin_recomend')   // 掘金

const JianShuSpider = require('./jianshu/jianshu_tecblogs')  // 简书

/**微博 */
router.get('/weibohot', (req, res) => {
    var weibo = new WeiboHotSpider()
    weibo.crawlList().then(data => {
        res.send(data)
    })
})

router.get('/weibosou', (req, res) => {
    var keyword = req.query.key   // 关键词
    var page = req.query.page     // 页数
    var weibo = new WeiboSearchSpider()
    weibo.crawlKeyword(keyword, page).then(data => {
        res.send(data)
    })
})

/**掘金 */
router.get('/juejin', (req, res) => {
    var juejin = new JuejinSpider()
    juejin.crawlList().then(data => {
        res.send(data)
    })
})

/**简书 */
router.get('/jianshu', (req, res) => {
    var jianshu = new JianShuSpider()
    jianshu.crawlList().then(data => {
        res.send(data)
    })
})

module.exports = router