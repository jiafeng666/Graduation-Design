const axios = require('axios')


module.exports = class JianShuSpider {
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
        let datalist = []
        const res = await axios.get('https://www.jianshu.com/programmers?type_id=27&count=50', 
            {
                headers: {
                    'user-agent': this.fakeUserAgent
                }
            }
        );
        var itemList = res.data;
        for (var i = 0; i<itemList.length; i++) {
            try{
                var item = itemList[i];
                var title = item['title'];
                var url = 'https://www.jianshu.com/p/' + item['slug'];
                var author = item['user']['nickname'];
                var author_url = 'https://www.jianshu.com/u/' + item['user']['slug'];
                var comments = item['comments_count'];
                var diggs = item['likes_count'];
                var views = item['views_count'];
                var desc = item['desc'];              

                var data = {
                    标题: title,
                    链接: url,
                    作者: author,
                    作者主页: author_url,
                    评论数: comments,
                    点赞数: diggs,
                    阅读数: views,
                    导语: desc
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
