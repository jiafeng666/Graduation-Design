const cheerio = require('cheerio');
const request = require('request');

module.exports = class DBActorExtractor{

   /**
     * 重试
     * @param {Function} func 重试的函数
     * @param {Object} config 重试的配置
     */
    async retry(func, config = { times: 5, default: null, params: [] }) {
        for (let i = 0; i < config.times; ++i) {
            try {
                return await func.apply(this, config.params);
            } catch (e) {
                console.log(`Retry(${i + 1}): ${e}`);
            }
        }
        return config.default;
    }

    async GetWorkInfo(ItemId){
        let workinfos = []
        let start = 0
        while (true) {
            let url = `https://movie.douban.com/celebrity/${ItemId}/movies?start=${start}&format=pic&sortby=time&`
            let resp = await this.retry(this.download, {times: 10, params: [url]})
            const $ = cheerio.load(resp);
            let text =$("div.grid_view>ul li h6 > a:nth-of-type(1)").text() || ""
            if (!text) {
                break
            }
            $("div.grid_view>ul li").each(function(index, element) {
                let info = {}
                let el = $(element)
                info.MovieUrl = el.find("h6 > a:nth-of-type(1)").attr("href")
                info.MovieName = el.find("h6 > a:nth-of-type(1)").text() || ""
                let MoviePublish = el.find("h6 > span:nth-of-type(2)").text() || ""
                if (MoviePublish.indexOf("未上映")==-1) {
                    info.MoviePublish = "已上映"
                }else{
                    info.MoviePublish = "未上映"
                }
                workinfos.push(info)
            });
            if (workinfos.length >= 10){
                break
            }
            start += 10
        }
        return workinfos
    }

    async CrawlerDetail(url) {
        let timestamp = Math.floor(Date.now() / 1000);
        let resp = await this.retry(this.download, {times: 10, params: [url]})
        const $ = cheerio.load(resp);
        let actorName = $('div h1').text().split(' ')[0]
        let ItemId = url.match(/\/\d+/mg)[0].replace('/', '')
        let workinfos = await this.retry(this.GetWorkInfo, {times: 20, params: [ItemId]})
        let data = {
            "姓名": actorName,
            "链接": url,
            "照片": $('#headline .nbg>img').attr("src") || '',
            "性别":  $("li:has(span:contains(性别))").text().replace(/\s+/g,"").replace("性别:", ""),
            "职业": $("li:has(span:contains(职业))").text().replace(/\s+/g,"").replace("职业:", ""),
            "生日": $("li:has(span:contains(出生日期))").text().replace(/\s+/g,"").replace("出生日期:", ""),
            "出生地": $("li:has(span:contains(出生地))").text().replace(/\s+/g,"").replace("出生地:", ""),
            "介绍": $('#intro > div:nth-of-type(2) > span.all.hidden').text() || '',
            "作品": workinfos,
        }
        let result = {
            status: 200,
            message: "success",
            data: [data],
            timestamp: timestamp
        }
        return result
    }

    async download(url){
        let headers = {
            'Host': `movie.douban.com`,
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/77.0.3865.120 Safari/537.36',
        }

        let opt = {
            url: url,
            method: 'GET',
            headers: headers,
            timeout:6000,
        }

        let res = await this.getRequest(opt);
        return res.body;
    }

    // 定义Promise函数
    getRequest(opts) {
        return new Promise((resolve, reject) => {
            request.get(opts, function (err, response, body) {
                //console.log('返回结果：');
                if (!err) {
                    if (body !== 'null') {
                        let results = {
                            body: body,
                            response: response
                        };
                        resolve(results);
                    } else {
                        reject(err);
                    }
                } else {
                    reject(err);
                }
            });
        });
    }
}
