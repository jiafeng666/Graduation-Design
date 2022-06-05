const axios = require('axios')
const cheerio = require('cheerio')

module.exports = class WeiboHotSpider {
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
        let ua = this.fakeUserAgent;
        this.headers = {
            'cookie': 'SUB=_2AkMWnvPlf8NxqwJRmfwXy2zra45xwg_EieKgwgI-JRMxHRl-yT92qkoItRB6PR7dCbX9j9FlK7shWS-nZe8ELfxZ9TQr; SUBP=0033WrSXqPxfM72-Ws9jqgMF55529P9D9WWyd9GPAJFa7PriQCVP5ryZ; SINAGLOBAL=673596789096.2557.1640135921593; UOR=,,www.baidu.com; _s_tentry=www.baidu.com; Apache=6296856937401.594.1651414132405; ULV=1651414132474:3:1:1:6296856937401.594.1651414132405:1644481959322',
            'user-agent': ua
        }
    }

    get fakeUserAgent() {
        const index = Math.floor(Math.random() * this.userAgents.length);
        return this.userAgents[index];
    }

    async crawlList() {
        let timestamp = Math.floor(Date.now() / 1000);
        // let listingUrl = `https://s.weibo.com/top/summary?cate=realtimehot`;
        const res = await axios.get('https://s.weibo.com/top/summary', {
            params: {
                'cate': 'realtimehot'
            },
            headers: this.headers
        });
        const $ = cheerio.load(res.data);
        var hotList = $('#pl_top_realtimehot>table>tbody>tr');

        var datalist = []
        for (var i=0; i<hotList.length; i++) {
            let each = $(hotList[i]);
            var title = each.find('td:nth-child(2)>a').text();
            var a_url = each.find('td:nth-child(2)>a');
            var url = 'https://s.weibo.com' + a_url.attr('href');
            var clicks = each.find('td:nth-child(2)>span').text();
            var tag = each.find('td:last-child>i').text();

            // const resp = await axios.get(url, {
            //     headers: this.headers
            // })
            // const $$ = cheerio.load(resp.data);
            // var summary = $$('.card.card-topic-lead.s-pg16').text().trim();

            var data = {
                标题: title,
                链接: url,
                点击数: clicks,
                标签: tag,
                // summary: summary
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
