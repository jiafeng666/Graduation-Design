const axios = require('axios')

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36";

class PinduoduoSearchSpider {
    async crawlList(keyword) {
        let timestamp = Math.floor(Date.now() / 1000);
        const res = await axios.post(
            'https://api.pinduoduo.com/api/jinbao/network/goods/common/list',
            {
                'customCrawlParam': true,
                'keyword': `${keyword}`,
                'categoryId': '',
                'pageNumber': 1,
                'pageSize': 60,
                'crawlerInfo': '0aoAfxvUuO1jY9TVHAInSzz8feAFGtdB2xk_IczvSmgdaqvmwh6QkkymazUy_K_uDTlUkzMqoD394YX8rrXRrooqBCgC9LVlwSJCVrt5s34CIKBPOOfrggZrBBsUh9ZkK1xQOzYh-Z5nFDGl9RkTSDtZYxIVvWa_gcNQP5qcoif3GcZ4-D5VpXiuruqXF3E5LTOC2mS5wwTD9dl9n3ZzGqw0dKYwcMdO-j6dhkA-SoxT8A-FgofQglwIr9gJ9VFtAkzeA1d4Jma8REsEpPQI44o1knqsFfJZMerygHeQ4U6kGN0mFl6BFBhZxsldYN5tHBp5pxC3BIrbwKpSKPqG9c-mED8KMBXbjzeZS8ov8B5Xuy_uwnQvKicyymMlPYpCeA4frdau1l1xPwBZwxCBIe51ZD2QL8T1itRD744iM1xGwWNOCacO5O8MLQOMNxN8eZRLDDEGX7vbR7_cG8RBUDq5NGunhRcyF9vhhcQhr9pvGE9Ib67hMtpqIRXGIOJqoWIiR-8iyNIW8J8-qY9zp_w7C'
            },
            {
                headers: {
                    'authority': 'api.pinduoduo.com',
                    'accept': '*/*',
                    'accept-language': 'zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7',
                    'accesstoken': 'L3DSJGGNYVNDR4G2UW3PMM5F4SBSKKVXR2SO7KQ2K2ROMO7QFVTA111bb9a',
                    'content-type': 'application/json; charset=UTF-8',
                    // 'cookie': 'api_uid=CkwbJmJwixcz7QBPvUMbAg==; jrpl=mtPbypTGOxA5CtuHCZDLVsi9zxSMM9om; njrpl=mtPbypTGOxA5CtuHCZDLVsi9zxSMM9om; dilx=Tvq29GXVOAJsR~~ibFCMv',
                    'origin': 'https://youhui.pinduoduo.com',
                    'referer': 'https://youhui.pinduoduo.com/',
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

        var goodsList = res.data.result.goodsList;
        var datalist = []
        for (var i = 0; i<goodsList.length; i++) {
            try{
                var goods = goodsList[i];
                var goodsName = goods['goodsName'];
                var url = `https://youhui.pinduoduo.com/goods/goods-detail?goodsId=${goods['goodsId']}&s=${goods['goodsSign']}`;
                var cate = goods['categoryName'];
                var sales = goods['salesTip'];
                var img = goods['goodsImageUrl'];
                var shop = goods['mallName'];

                var data = {
                    关键词: keyword,
                    标题: goodsName,
                    链接: url,
                    分类: cate,
                    销量: sales,
                    图片: img,
                    店铺: shop
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

module.exports = PinduoduoSearchSpider;