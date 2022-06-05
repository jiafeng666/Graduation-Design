const axios = require('axios')
const cheerio = require('cheerio');

module.exports = class Five8NewHouseExtractor {
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

    async crawlList(keyword, pageNum) {
        if (pageNum == ''){
            pageNum = 1
        }
        let timestamp = Math.floor(Date.now() / 1000);
        let datalist = [];
        let ua = this.fakeUserAgent;
        for (let page=1; page<=pageNum; page++){
            let listingUrl = `https://${keyword}.58.com/xinfang/loupan/all/p${page}/`
            const res = await axios({
                method: 'get',
                url: listingUrl,
                headers: {
                    'authority': 'sz.58.com',
                    'accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'accept-language': 'zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7',
                    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"',
                    'sec-fetch-dest': 'document',
                    'sec-fetch-mode': 'navigate',
                    'sec-fetch-site': 'none',
                    'sec-fetch-user': '?1',
                    'upgrade-insecure-requests': '1',
                    'user-agent': ua
                }
            });
            let $ = cheerio.load(res.data);
            let houstList = $('.key-list.imglazyload>div');
            for(var j=0; j<houstList.length; j++) {
                var house = $(houstList[j]);
                var title = house.find('.items-name').text().trim();
                var url = house.find('.lp-name').attr('href');
                var cate = house.find('.status-icon.wuyetp').text();
                var location = house.find('.list-map').text().trim();
                var area_ = house.find('.huxing').text();
                var area = area_.replace(/\s*/g, '');
                var price = house.find('.price').text() || '';

                var data = {
                    楼盘名称: title,
                    链接: url,
                    分类: cate,
                    地址: location,
                    面积: area,
                    价格: price,
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
