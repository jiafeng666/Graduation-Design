const axios = require('axios')


module.exports = class JuejinSpider {
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
        for (var j=0; j<2; j++){
            const res = await axios.post(
                'https://api.juejin.cn/recommend_api/v1/article/recommend_all_feed',
                {
                    'id_type': 2,
                    'client_type': 2608,
                    'sort_type': 200,
                    'cursor': `${j}`,
                    'limit': 20
                },
                {
                    params: {
                        'aid': '2608',
                        'uuid': '7047399474239768094'
                    },
                    headers: {
                        'authority': 'api.juejin.cn',
                        'accept': '*/*',
                        'accept-language': 'zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7',
                        'content-type': 'application/json',
                        // 'cookie': '_ga=GA1.2.645891180.1640850562; MONITOR_WEB_ID=12346353-255f-4129-9909-5cf120596692; __tea_cookie_tokens_2608=%257B%2522web_id%2522%253A%25227047399474239768094%2522%252C%2522ssid%2522%253A%2522f97c7b1d-aa9c-42bb-90df-983ecf2fe9cc%2522%252C%2522user_unique_id%2522%253A%25227047399474239768094%2522%252C%2522timestamp%2522%253A1640850561819%257D; _tea_utm_cache_2608={%22utm_source%22:%22bdpcjjhd01405%22%2C%22utm_medium%22:%22sem_baidu_jj_pc_dc01%22%2C%22utm_campaign%22:%22sembaidu%22}; _gid=GA1.2.57498160.1651551185',
                        'origin': 'https://juejin.cn',
                        'referer': 'https://juejin.cn/',
                        'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
                        'sec-ch-ua-mobile': '?0',
                        'sec-ch-ua-platform': '"Windows"',
                        'sec-fetch-dest': 'empty',
                        'sec-fetch-mode': 'cors',
                        'sec-fetch-site': 'same-site',
                        'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36'
                    }
                }
            );
            var itemList = res.data.data;
            for (var i = 0; i<itemList.length; i++) {
                try{
                    var item = itemList[i]['item_info'];
                    var title = item['article_info']['title'];
                    var url = 'https://juejin.cn/post/' + item['article_id'];
                    var author = item['author_user_info']['user_name'];
                    var author_url = 'https://juejin.cn/user/' + item['author_user_info']['user_id'];
                    var comments = item['article_info']['comment_count'];
                    var diggs = item['article_info']['digg_count'];
                    var views = item['article_info']['view_count'];
                    var breif = item['article_info']['brief_content'];
                    var pubtime = this.parseTime(parseInt(item['article_info']['ctime']));                

                    var data = {
                        标题: title,
                        链接: url,
                        作者: author,
                        作者主页: author_url,
                        发布时间: pubtime,
                        评论数: comments,
                        点赞数: diggs,
                        阅读数: views,
                        导语: breif
                    };
                    datalist.push(data);
                }catch (e){
                    console.log(e)
                }   
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

    parseTime(time) {
        if (typeof time === 'number') {
            return new Date(time * 1000).toLocaleString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' });
        }
        return '';
    }
}
