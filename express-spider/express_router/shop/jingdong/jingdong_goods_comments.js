const request = require('request');
const iconv = require('iconv-lite');
const log4js = require('log4js');

// ua列表
const userAgentList = [
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/86.0.4240.198 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/78.0.3904.108 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299",
]

/**
 * 京东商品评论数据获取类
 *
 * @class JDDetailSpider
 * @extends {Extractor}
 */
class JDCommentSpider {
    /**
     * 抓取流程
     *
     * @param {*} parameter
     * @memberof JDCommentSpider
     */
    async crawlItem(parameter) {
        let timestamp = Math.floor(Date.now() / 1000);
        let datalist = [];
        let skuId = parameter.match(/\d+/)[0];
        let page = 0;
        while (page < 5) {
            page++;
            let commentUrl = `https://club.jd.com/comment/productPageComments.action?callback=fetchJSON_comment98&productId=${skuId}&score=0&sortType=6&page=${page}&pageSize=10&isShadowSku=0&fold=1`;
            let resp = await this.retry(this.requestComment, { times: 30, params: [commentUrl] });
            let resBody = resp['resBody'];
            resBody = resBody.replace("fetchJSON_comment98(", "").replace(");", "").replace("'", "");
            resBody = JSON.parse(resBody);

            // 评论量
            let commentCount = resBody["productCommentSummary"]["commentCountStr"];
            // 评论列表
            let comments = resBody["comments"];
            if (comments.length == 0) {
                this.logger.info(`商品skuid：${skuId}，第${page}页没有评论`);
            } else {
                for (const comment of comments) {
                    // 评论用户名
                    let nickName = comment["nickname"];
                    // 评论评分
                    let commentScore = comment["score"];
                    // 评论内容
                    let commentContent = comment["content"];
                    // 评论商品名
                    let commentGoodsName = comment["referenceName"];
                    // 评论时间
                    let commentTime = comment["creationTime"];
                    // 采集时间
                    // let crawlTime = new Date().Format("yyyy-MM-dd hh:mm:ss");

                    // 处理一下评论时间
                    commentTime = commentTime.replace(/\-/g, '/');
                    let goods_url = `https://item.jd.com/${skuId}.html`
                    // 改回原来的时间格式
                    commentTime = commentTime.replace(/\//g, '-');

                    let data = {
                        "skuid": skuId,
                        '商品链接': goods_url,
                        "评论量": commentCount,
                        "评论用户": nickName,
                        "评论评分": commentScore,
                        "评论内容": commentContent,
                        "商品名": commentGoodsName,
                        "评论时间": commentTime,
                        // "采集时间": crawlTime
                    };

                    datalist.push(data);
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
                this.logger.debug(`Retry function ${func.name}(${i + 1}): ${e}`);
                sleep(sleepSeconds);
            }
        }

        return defaultValue;
    }

    /**
     * 评论请求方法
     *
     * @param {*} commentUrl 
     * @param {boolean} [proxy=false]
     * @memberof JDComments
     */
    async requestComment(commentUrl) {
        try {
            // 设置请求参数
            let min = 0;
            var max = userAgentList.length - 1;
            let index = parseInt(Math.random() * (+max - +min) + +min);
            let userAgent = userAgentList[index];
            let opt = {
                url: commentUrl,
                method: 'GET',
                headers: { 'User-Agent': userAgent },
                timeout: 10000,
                encoding: null,
                gzip: true
            };

            let res = await this.getRequest(opt);
            if (res.body == '') {
                throw new Error(`res is null`);
            }

            let returnContent = { 'resBody': res.body};
            return returnContent;

        } catch (error) {
            this.logger.error(error);
            throw error;
        }
    }

    /**
     * 请求方法
     *
     * @param {*} opts
     * @return {*} 
     * @memberof JDComments
     */
    async getRequest(opts) {
        return new Promise((resolve, reject) => {
            request.get(opts, function (err, response, body) {
                if (!err) {
                    if (body !== 'null') {
                        if (response.headers['content-type'] == 'text/html;charset=GBK') {
                            let results = {
                                body: iconv.decode(body, 'gbk').toString(),
                                response: response
                            };
                            resolve(results);
                        }
                    } else {
                        reject(err);
                    }
                } else {
                    reject(err);
                }
            });
        });
    }

    /**
     * 获取日志实例
     *
     * @readonly
     * @memberof JDCommentSpider
     */
    get logger() {
        this._context.lastLogTime = new Date();
        if (!this._logger) {
            this._logger = log4js.getLogger();
        }
        return this._logger;
    }
}

Date.prototype.Format = function (fmt) {
    var o = {
        "M+": this.getMonth() + 1, // 月份
        "d+": this.getDate(), // 日
        "h+": this.getHours(), // 小时
        "m+": this.getMinutes(), // 分
        "s+": this.getSeconds(), // 秒
        "q+": Math.floor((this.getMonth() + 3) / 3), // 季度
        "S": this.getMilliseconds() // 毫秒
    };
    if (/(y+)/.test(fmt))
        fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
    for (var k in o)
        if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    return fmt;
}

/**
 * 按传入秒进行休眠
 * @param {int} seconds
 */
function sleep(seconds) {
    var nowTime = new Date();
    var exitTime = nowTime.getTime() + seconds;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}

String.prototype.encodeHTML = function () {
    return this.replace(/[\u0000-\u001F]/g, '').replace(/[\u007F-\u00AD]/g, '');
};

module.exports = JDCommentSpider;