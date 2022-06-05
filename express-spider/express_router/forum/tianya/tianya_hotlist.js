const axios = require('axios')


module.exports = class TianYaSpider {
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
        let listingUrl = `https://bbs.tianya.cn/api?method=bbs.ice.getHotArticleList&params.pageSize=50&params.pageNum=1`;
        let ua = this.fakeUserAgent;
        const res = await axios({
            method: 'get',
            url: listingUrl,
            headers: {
                'user-agent': ua
            }
        });

        let newsList = res.data.data.rows
        var datalist = []
        for (var i = 0; i<newsList.length; i++) {
            try{
                var news = newsList[i];
                var title = news['title'];
                var url = news['url'];
                var type = news['type'];
                var author = news['author_name'];
                var author_url = 'http://www.tianya.cn/' + news['author_id']
                var pubtime = news['time'].slice(0, -3);
                var content = news['content'].trim()
                var img = news['pics'][0];

                var data = {
                    标题: title,
                    链接: url,
                    类型: type,
                    作者: author,
                    作者主页: author_url,
                    发布时间: pubtime,
                    图片: img,
                    内容: content
                };
                datalist.push(data);
            }catch (e){
                console.log(e)
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
