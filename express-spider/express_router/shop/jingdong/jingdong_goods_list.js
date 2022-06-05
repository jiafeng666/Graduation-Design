const axios = require('axios')
const cheerio = require('cheerio')


module.exports = class JDListSpider {
    constructor() {
        this.userAgents = [
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:70.0) Gecko/20100101 Firefox/73.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.118 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0'
        ];
    }

    get fakeUserAgent() {
        const index = Math.floor(Math.random() * this.userAgents.length);
        return this.userAgents[index];
    }

    async crawlList(keyword, pageNum) {
        if (pageNum == ''){
            pageNum = 1
        }
        let timestamp = Math.floor(Date.now() / 1000);
        let datalist = [];
        for(let page=1; page<=pageNum; page++){
            let url = `https://search.jd.com/Search?keyword=${encodeURI(keyword)}&page=${page}`;
            let ua = this.fakeUserAgent;
            const res = await axios({
                method: 'get',
                url: url,
                headers: {
                    'user-agent': ua
                }
            });
            const $ = cheerio.load(res.data);
            const goods = $('.gl-warp.clearfix>li');
            
            for(let i=0; i<goods.length; i++){
                let each = $(goods[i]);
                let title = each.find('.gl-i-wrap .p-name>a>em').text();
                let a_url = each.find('.gl-i-wrap .p-name>a');
                let url = 'https:' + a_url.attr('href');
                let price = '￥' + each.find('.gl-i-wrap .p-price>strong>i').text();
                // let comments = each.find('.gl-i-wrap .p-commit>strong>a').text();
                let shop = each.find('.gl-i-wrap .p-shop>span>a').text();
                
                var data = {
                    关键词: keyword,
                    标题: title,
                    链接: url,
                    价格: price,
                    // comments: comments,
                    店铺: shop,
                    页数: page
                }
                datalist.push(data);
            }
            
        }
        let result = {
            status: 200,
            message: "success",
            data: datalist,
            timestamp: timestamp
        }
        return result
    }
}