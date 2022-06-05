const axios = require('axios')
const cheerio = require('cheerio')


module.exports = class ZhihuHotlistSpider {
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

    async crawlList() {
        let timestamp = Math.floor(Date.now() / 1000);
        let listingUrl = `https://www.zhihu.com/billboard`;
        let ua = this.fakeUserAgent;
        const res = await axios({
            method: 'get',
            url: listingUrl,
            headers: {
                'user-agent': ua
            }
        });
        const $ = cheerio.load(res.data);
        var data = JSON.parse($('#js-initialData').html());
        var hotList = data.initialState.topstory.hotList;
        var datalist = []
        for (var i = 0; i < hotList.length; i++) {
            var hot = hotList[i];
            var title = hot.target.titleArea.text;
            var link = hot.target.link.url
            var hotDegree = hot.target.metricsArea.text
            var content = hot.target.excerptArea.text
            var img = hot.target.imageArea.url
            var data = {
                标题: title,
                链接: link,
                热度: hotDegree,
                导语: content,
                图片: img
            }
            datalist.push(data);   
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
