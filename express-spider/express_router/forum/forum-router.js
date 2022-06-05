const express = require('express')
const router = express.Router()
const ZhihuHotlistSpider = require('./zhihu/zhihu_hotlist')  // 知乎
const ZhihuSearchSpider = require('./zhihu/ZhihuSearch')

const DBActorExtractor = require('./douban/DoubanActors')   // 豆瓣
const DBMovieExtractor = require('./douban/DoubanMovieDetail')
const DBCommentExtractor = require('./douban/doubanComment')

const TianYaSpider = require('./tianya/tianya_hotlist')   // 天涯

/**知乎 */
router.get('/zhihuhot', (req, res) => {
    var zhihu = new ZhihuHotlistSpider()
    zhihu.crawlList().then(data => {
        res.send(data)
    })
})

router.get('/zhihusou', (req, res) => {
    keyword = req.query.key         // 刘畊宏是哪里人
    var zhihu = new ZhihuSearchSpider()
    zhihu.crawlSearchEntrypoint(keyword).then(data => {
        res.send(data)
    })
})


/**豆瓣 */
router.get('/dbactor', (req, res) => {
    let url = req.query.key    // 演员url：https://movie.douban.com/celebrity/1054521/
    var douban = new DBActorExtractor()
    douban.CrawlerDetail(url).then(data => {
        res.send(data)
    })
})

router.get('/dbmovie', (req, res) => {
    let url = req.query.key    // 影片url：https://movie.douban.com/subject/1292052/
    var douban = new DBMovieExtractor()
    douban.CrawlerDetail(url).then(data => {
        res.send(data)
    })
})

router.get('/dbcomment', (req, res) => {
    let url = req.query.key    // 话题url：https://www.douban.com/group/topic/265650880/?_i=1484733aMc3fHK
    var douban = new DBCommentExtractor()
    douban.crawlDetail(url).then(data => {
        res.send(data)
    })
})


/**天涯 */
router.get('/tianya', (req, res) => {
    var tianya = new TianYaSpider()
    tianya.crawlList().then(data => {
        res.send(data)
    })
})


module.exports = router

