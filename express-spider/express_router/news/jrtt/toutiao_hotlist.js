const axios = require('axios')
const cheerio = require('cheerio')


module.exports = class TouTiaoSpider {
    constructor() {
        this.userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:66.0) Gecko/20100101 Firefox/66.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:70.0) Gecko/20100101 Firefox/73.0',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_2) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.118 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; WOW64; Trident/7.0; rv:11.0) like Gecko',
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36',
            'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.1.1 Safari/605.1.15',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36'
        ];
    }

    get fakeUserAgent() {
        const index = Math.floor(Math.random() * this.userAgents.length);
        return this.userAgents[index];
    }

    async crawlList() {
        let timestamp = Math.floor(Date.now() / 1000);
        let listingUrl = `https://tophub.today/n/x9ozB4KoXb`;
        let ua = this.fakeUserAgent;
        const res = await axios({
            method: 'get',
            url: listingUrl,
            headers: {
                'user-agent': ua
            }
        });
        var $ = cheerio.load(res.data);
        var links = $('.al a:link');
        var titles = $('.al a');
        var hots = $('.al+td');

        let datalist = [];
        for (var i=0; i<50; i++){
            var url = 'https://tophub.today' + links[i].attribs.href;
            var title = titles[i].children[0].data;
            var hot_degree = hots[i].children[0].data;

            // let resp = await axios.get(url, {headers: {'user-agent': this.fakeUserAgent}});
            // var $$ = cheerio.load(resp.data);
            // var pubtime = $$('.whitespace-nowrap.flex-shrink-0>span:first-child').text();
            // var comment_conut = $$('.whitespace-nowrap.flex-shrink-0>span:nth-child(2)').text();
            // var read_conut = $$('.whitespace-nowrap.flex-shrink-0>span:last-child').text();

            var data = {
                标题: title,
                链接: url,
                热度: hot_degree
                // pubtime: pubtime,
                // comment_count: comment_conut.replace(/评论/, ''),
                // read_conut: read_conut.replace(/阅读/, ''),
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
