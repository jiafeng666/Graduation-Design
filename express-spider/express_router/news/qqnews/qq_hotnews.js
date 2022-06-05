const axios = require('axios')


module.exports = class QQNewsSpider {
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
        let listingUrl = `https://i.news.qq.com/trpc.qqnews_web.kv_srv.kv_srv_http_proxy/list?sub_srv_id=24hours&srv_id=pc&offset=0&limit=50&strategy=1&ext={"pool":["top"],"is_filter":7,"check_type":true}`;
        let ua = this.fakeUserAgent;
        const res = await axios({
            method: 'get',
            url: listingUrl,
            headers: {
                'user-agent': ua
            }
        });

        var newsList = res.data.data.list;
        var datalist = []
        for (var i = 0; i<newsList.length; i++) {
            try{
                var news = newsList[i];
                var title = news['title'];
                var url = news['url'];
                var cate = news['category_cn'];
                var media = news['media_name'];
                var pubtime = news['publish_time'];
                var img = news['img'];
                var tags = news['tags'];
                var tag = '';
                for(var j=0; j<tags.length; j++){
                    if(j == tags.length-1){
                        tag += tags[j]['tag_word']
                    }else{
                        tag += tags[j]['tag_word'] + '、'
                    }
                };

                var data = {
                    标题: title,
                    链接: url,
                    类型: cate,
                    媒体: media,
                    发布时间: pubtime,
                    图片: img,
                    标签: tag
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
