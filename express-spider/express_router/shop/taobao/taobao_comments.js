const assert = require('assert');
const axios = require('axios');

const COOKIE = 'lid=funpnopj538; t=617d0ef23d8a452e9b1472b0a61aa58b; tracknick=funpnopj538; enc=zTwmZoRVWBu3u9Foa0hm/nWlBtwoYCPu2/oSISBQk8Tg7o0Jb4jBGIpjRs+rNMFYtLeS8ugowj00mqflGWhfEA==; _tb_token_=e6359ae3796b8; cookie2=18453770df51988b0f33f86251f3c0dd; cna=mRA9GsR2HA0CAXkgMPcJiJ+V; xlly_s=1; dnk=funpnopj538; uc1=pas=0&cookie16=VFC/uZ9az08KUQ56dCrZDlbNdA==&cookie21=Vq8l+KCLjhS4UhJVac7m&cookie15=WqG3DMC9VAQiUQ==&existShop=false&cookie14=UoexMycSKE3v6g==; uc3=vt3=F8dCvC6DopzSg5rlMC4=&nk2=BcWVob/mhqJsPnI=&id2=UUpgRS92yhR4RQ==&lg2=V32FPkk/w0dUvg==; _l_g_=Ug==; uc4=nk4=0@B0nK9QhNL2l6dkZC+PnLJDRi3yHGkQ==&id4=0@U2gqykeYePuFfFT9uPgJXcrVSuws; unb=2213720876; lgc=funpnopj538; cookie1=VT5Zxfw/LEpc6/8SmzRzuJ+ma/wug14m3ZrOBpErD5c=; login=true; cookie17=UUpgRS92yhR4RQ==; _nk_=funpnopj538; sgcookie=E100YotFz4r0VVryhzL+VqbV6r0tsDZJgea56ljXlQmW0iAPigkHU/WRZ4M4e1+rCwUIeuJyloV73cU2HBPteZU23gV3XPZDhnZybOeSphW5zJl5cc30U33KZ0LsuW7xw+NL; cancelledSubSites=empty; sg=869; csg=d03f6dc1; tfstk=ceLABF0IdYDD5A5JTnnk_GzlNb8OZ1FAIS6TWFUzO9ULBOaOinYHJJdic1WFHbC..; l=eBT4iNggLydKdQuUBOfZhurza77TpIRxIuPzaNbMiOCPO_f65wIfW6qnDg8BCnhVh67XR353_mDLBeYBqCqgx6aNa6Fy_IHmn; isg=BISEd6xruhhVmg7UAMPUoCRpVQJ2nagHmAQssJ4lKs8TySSTxq_vlppnCGERYOBf';
const USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.102 Safari/537.36';

module.exports = class TaobaoRatesExtractor {
    /**
     * 重试
     * @param {Function} func 重试的函数
     * @param {Object} config 重试的配置
     */
    async retry(func, config = { times: 5, default: null, params: [], sleep: 1 }) {
        for (let i = 0; i < config.times; ++i) {
            try {
                return await func.apply(this, config.params);
            } catch (e) {
                this.logger.debug(`Retry(${i + 1}): ${e}`);
            }
        }
        await sleep(config.sleep);
        return config.default;
    }

    get logger() {
        this._context.lastLogTime = new Date();
        if (!this._logger) {
            this._logger = require('log4js').getLogger();
        }
        return this._logger;
    }

    async crawlPage(itemId, pageNum) {
        if (pageNum == ''){
            pageNum = 1
        }
        let timestamp = Math.floor(Date.now() / 1000);
        let datalist = [];
        for(let page=1; page<=pageNum; page++){
            let resp = await axios.get(`https://rate.tmall.com/list_detail_rate.htm?itemId=${itemId}&spuId=980475475&sellerId=1745055043&order=1&currentPage=${page}&append=0&content=1&tagId=&posi=&picture=0&ua=098`, {
                headers: {
                    'User-Agent': USER_AGENT,
                    'Referer': `https://detail.tmall.com/item.htm?id=${itemId}`,
                    'Cookie': COOKIE,
                },
                timeout: 5000,
            });
            let data = JSON.parse(resp.data.replace(/^\W*jsonp128\(/ig, '').replace(/\)$/ig, ''));

            let rateList = data.rateDetail.rateList;
            for (let rateItem of rateList) {
                let item = {
                    '商品ID': itemId,
                    '评论ID': rateItem.id || '',
                    '用户昵称': rateItem.displayUserNick || '',
                    '颜色分类': rateItem.auctionSku || '',
                    // '追评时间': rateItem.appendComment ? rateItem.appendComment.commentTime : '',
                    // '追评内容': rateItem.appendComment ? rateItem.appendComment.content : '',
                    // '追评天数': rateItem.appendComment ? rateItem.appendComment.days : '',
                    '评论内容': rateItem.rateContent || '',
                    '评论时间': rateItem.rateDate || '',
                    '页码': page
                };
                datalist.push(item);
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
