const express = require('express')
const router = express.Router()

const JDListSpider = require('./jingdong/jingdong_goods_list')    // 京东
const JDCommentSpider = require('./jingdong/jingdong_goods_comments')

const TaobaoRatesExtractor = require('./taobao/taobao_comments')   // 淘宝

const PinduoduoSearchSpider = require('./pinduoduo/PinduoduoKeywordDetail')  // 拼多多

/**京东 */
router.get('/jdlist', (req, res) => {
    var keyword = req.query.key      // 关键词
    var pageNum = req.query.page      // 页数
    var jingdong = new JDListSpider()
    jingdong.crawlList(keyword, pageNum).then( data => {
        res.send(data)
    })
})

router.get('/jdcomment', (req, res) => {
    var url = req.query.key       // url: https://item.jd.com/100024333012.html
    var jingdong = new JDCommentSpider()
    jingdong.crawlItem(url).then( data => {
        res.send(data)
    })
})


/**淘宝 */
router.get('/taobao', (req, res) => {
    var itemId = req.query.key    // 商品id：598688549184
    var page = req.query.page     // 页数
    var taobao = new TaobaoRatesExtractor()
    taobao.crawlPage(itemId, page).then( data => {
        res.send(data)
    })
})


/**拼多多 */
router.get('/pdd', (req, res) => {
    var keyword = req.query.key  // 关键词
    var pdd = new PinduoduoSearchSpider()
    pdd.crawlList(keyword).then(data => {
        res.send(data)
    })
})

module.exports = router
