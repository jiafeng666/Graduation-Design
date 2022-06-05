const axios = require('axios')
const cheerio = require('cheerio')


module.exports = class DBCommentExtractor {
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

    async crawlDetail(url) {
        let timestamp = Math.floor(Date.now() / 1000);
        let ua = this.fakeUserAgent;
        const res = await axios({
            method: 'get',
            url: url,
            headers: {
                'user-agent': ua
            }
        });
        var $ = cheerio.load(res.data);
        var title = $('.article>h1').text().trim();
        var author = $('.from>a').text().trim();
        var author_url = $('.from>a').attr('href');
        var pubtime = $('.topic-doc span:last-child').text().trim();
        var content = ''
        $('.rich-content.topic-richtext>p').each(function(index, element) {
            content += $(element).text() + '\n'
        });
        const comment_man = $('#comments>li:first-child h4 a').text();
        const comment_man_url = $('#comments>li:first-child h4 a').attr('href')
        const comment_time = $('#comments>li:first-child h4 span').text();
        const comment = $('#comments>li:first-child  .reply-content').text();

        var data = {
            标题: title,
            链接: url,
            作者: author,
            作者主页: author_url,
            发表时间: pubtime,
            内容: content,
            评论人: comment_man,
            评论人主页: comment_man_url,
            评论时间: comment_time,
            评论内容: comment
        }

        let result = {
            status: 200,
            message: "success",
            data: [data],
            timestamp: timestamp
        }
        return result
    }
}
