const cheerio = require('cheerio');
const axios = require('axios').default;

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:62.0) Gecko/20100101 Firefox/62.0";


module.exports = class AnjukeExtractor{
    async sleep(seconds) {
        await new Promise((resolve) => setTimeout(resolve, seconds * 1000));
    }

    get logger() {
        if (!this._logger) {
            this._logger = require('log4js').getLogger();
        }
        return this._logger;
    }

    async crawlItem(url) {
        let timestamp = Math.floor(Date.now() / 1000);
        const resp = await axios.get(url, {
            headers: {
                'User-Agent': USER_AGENT,
            },
            timeout: 5000,
        });

        const $ = cheerio.load(resp.data);
        const upload = {
            '标题': ($('.house-title').text() || '').trim(),
            '链接': url,
            '图片链接': $('#room_pic_wrap .img_wrap img').attr('data-src') || '',
            '租金': ($('ul.house-info-zufang > li:nth-of-type(1) .price').text() || '').trim(),
            '房型': ($('ul.house-info-zufang > li:nth-of-type(2) .info').text() || '').trim(),
            '面积': ($('ul.house-info-zufang > li:nth-of-type(3) .info').text() || '').trim(),
            // '租金押付': $('ul.house-info-zufang > li:nth-of-type(1) .type').text() || '',
            // '装修': $('ul.house-info-zufang > li:nth-of-type(6) .info').text() || '',
            // '朝向': $('ul.house-info-zufang > li:nth-of-type(4) .info').text() || '',
            // '楼层': $('ul.house-info-zufang > li:nth-of-type(5) .info').text() || '',
            // '类型': $('ul.house-info-zufang > li:nth-of-type(7) .info').text() || '',
            '城市': ($('.city-view').text() || '').replace(new RegExp(String.fromCharCode(0xE030), 'g'), '').trim(),
            '区域': $('ul.house-info-zufang > li:nth-of-type(8) > a:nth-of-type(2)').text() || '',
            // '所在小区': $('ul.house-info-zufang > li:nth-of-type(8) > a:nth-of-type(1)').text() || '',
            '位置': $('ul.house-info-zufang > li:nth-of-type(8) > a:nth-of-type(3)').text() || '',
            // '租赁方式': $('.title-label-item.rent').text() || '',
            // '房源编号': $('#houseCode').text() || '',
            // '发布时间': ($('#houseCode + b').text() || '').trim(),
            // '联系人': ($('.broker-name').text() || '').trim(),
            // '联系人评价': $('.brokercard-sd-cont > span.score-up:nth-of-type(3) .score-num').text() || '',
        };
        let result = {
            status: 200,
            message: "success",
            data: [upload],
            timestamp: timestamp
        }
        return result
    }

    /**
     * 重试
     * @param {Function} func 重试的函数
     * @param {Object} config 重试的配置
     */
    async retry(func, config = {}) {
        const defaultConfig = {
            times: 5,
            default: undefined,
            params: [],
            sleep: 1,
        };
        const times = config.times || defaultConfig.times;
        const defaultValue = config.default || defaultConfig.default;
        const params = config.params || defaultConfig.params;
        const sleepSeconds = config.sleep || defaultConfig.sleep;
        for (let i = 0; i < times; ++i) {
            try {
                return await func.apply(this, params);
            } catch (e) {
                this.logger.debug(`Retry(${i + 1}): ${e}`);
            }
        }
        await this.sleep(sleepSeconds);
        return defaultValue;
    }
};