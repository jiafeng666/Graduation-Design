const express = require('express')
const router = express.Router()

const TouTiaoSpider = require('./jrtt/toutiao_hotlist')

const QQNewsSpider = require('./qqnews/qq_hotnews')

const NeteaseNewsSpider = require('./netease/NeteaseArticleListByCityIDExtractor')

/**今日头条 */
router.get('/jrtt', (req, res) => {
    var toutiao = new TouTiaoSpider()
    toutiao.crawlList().then( data => {
        res.send(data)
    })
})

/**腾讯新闻 */
router.get('/qqnews', (req, res) => {
    var qq = new QQNewsSpider()
    qq.crawlList().then( data => {
        res.send(data)
    })
})


/**网易新闻 */
router.get('/netease', (req, res) => {
    cityid = req.query.key    // cityid(441800)，获取：https://v6-gw.m.163.com/nc/api/v1/local/city.html
    var net = new NeteaseNewsSpider()
    net.crawlList(cityid).then( data => {
        res.send(data)
    })
})



module.exports = router