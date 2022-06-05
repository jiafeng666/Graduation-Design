const axios = require('axios')
const cheerio = require('cheerio');

module.exports = class LianJiaNewHouseExtractor {
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
            let listingUrl = `https://${keyword}.fang.lianjia.com/loupan/pg${page}`
            const res = await axios({
                method: 'get',
                url: listingUrl,
                headers: {
                    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                    'Accept-Language': 'zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7',
                    'Cache-Control': 'max-age=0',
                    'Connection': 'keep-alive',
                    'Referer': 'https://gz.lianjia.com/',
                    'Sec-Fetch-Dest': 'document',
                    'Sec-Fetch-Mode': 'navigate',
                    'Sec-Fetch-Site': 'same-site',
                    'Sec-Fetch-User': '?1',
                    'Upgrade-Insecure-Requests': '1',
                    'User-Agent': ua,
                    'sec-ch-ua': '" Not A;Brand";v="99", "Chromium";v="100", "Google Chrome";v="100"',
                    'sec-ch-ua-mobile': '?0',
                    'sec-ch-ua-platform': '"Windows"'
                }
            });
            let $ = cheerio.load(res.data);
            let houstList = $('.resblock-list-wrapper>li');
            for(var j=0; j<houstList.length; j++) {
                var house = $(houstList[j]);
                var title = house.find('.resblock-name>a').text().trim();
                var url = 'https://gz.fang.lianjia.com' + house.find('.resblock-name>a').attr('href');
                var cate = house.find('.resblock-name>span.resblock-type').text();
                var location_ = house.find('.resblock-location').text();
                var location = location_.replace(/\s*/g, '');
                var area = house.find('.resblock-area').text().trim();
                var type_ = house.find('.resblock-room').text().trim().replaceAll('\n', '').replaceAll('\t', '');
                var type = type_.replace(/\s*/g, '');
                var per_price = house.find('.main-price>span').text();
                var total_price = house.find('.second').text() || "";

                var data = {
                    楼盘名称: title,
                    链接: url,
                    分类: cate,
                    地址: location,
                    面积: area,
                    户型: type,
                    '价格/每平': per_price,
                    '价格/整套': total_price,
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
