const axios = require('axios').default;

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0";


module.exports = class WeiboSearchSpider {
    async crawlKeyword(keyword, pageNum) {
        if (pageNum == ''){
            pageNum = 1
        }
        let timestamp = Math.floor(Date.now()/1000);
        let datalist = []
        for(var page=1; page<=pageNum; page++){
            const resp = await axios.get('https://m.weibo.cn/api/container/getIndex', {
                headers: {
                    'User-Agent': USER_AGENT,
                },
                params: {
                    containerid: `100103type=61&q=${encodeURIComponent(keyword)}&t=0`,
                    page_type: 'searchall',
                    page: page,
                },
                timeout: 5000,
            });

            const data = resp.data;
            const cards = data.data.cards;
            for (const card of cards) {
                if (!card.hasOwnProperty('mblog')) {
                    console.log('Not mblog card');
                    continue;
                }
                const mblog = card.mblog || {};
                const user = mblog.user || {};
                const longText = mblog.longText || {};

                const upload = {
                    '关键字': keyword,
                    '微博ID': mblog.id || '',
                    '链接': `https://weibo.com/${user.id}/${mblog.bid}`,
                    '内容': longText.longTextContent || mblog.text || '',
                    '发表设备': mblog.source || '',
                    '发表时间': mblog.created_at || '',
                    '作者主页': `https://weibo.com/u/${user.id}` || '',
                    '作者昵称': user.screen_name || ''
                };
                datalist.push(upload)
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
};