const cheerio = require('cheerio');
const request = require('request');


module.exports = class DBMovieExtractor {
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
                console.log(`Retry(${i + 1}): ${e}`);
            }
        }
        await sleep(config.sleep);
        return config.default;
    }

    async GetAllPeople(ItemId){
        let url = `https://movie.douban.com/subject/${ItemId}/celebrities`
        let resp = await this.retry(this.download, {times: 100, params: [url]})
        const $ = cheerio.load(resp);
        let data = {}
        let actors = [];
        let directors = [];
        let screenwriters = [];
        let moviemakers = [];

        $("h2:contains(演员)+ul li").each(function(index, element) {
            let info = {}
            let el = $(element)
            info.name = el.find("span.name a").attr("title").split(" ")[0]
            actors.push(info)
        });

        $("h2:contains(导演)+ul li").each(function(index, element) {
            let info = {}
            let el = $(element)
            info.name = el.find("span.name a").attr("title").split(" ")[0]
            directors.push(info)
        });

        $("h2:contains(编剧)+ul li").each(function(index, element) {
            let info = {}
            let el = $(element)
            info.name = el.find("span.name a").attr("title").split(" ")[0]
            screenwriters.push(info)
        });


        $("h2:contains(制片人)+ul li").each(function(index, element) {
            let info = {}
            let el = $(element)
            info.name = el.find("span.name a").attr("title").split(" ")[0]
            moviemakers.push(info)
        });

        data.actors = actors
        data.directors = directors
        data.screenwriters = screenwriters
        data.moviemakers = moviemakers
        return data
    }

    async CrawlerDetail(url) {
        let timestamp = Math.floor(Date.now() / 1000);
        let resp = await this.retry(this.download, {times: 100, params: [url]});
        let name = DBMovieExtractor.reg_search(/"name": "(.*?)",/, resp);

        let actorsInfoList = await this.retry(this.actorsInMovie, {times: 2, default: [],params: [resp]});
        const $ = cheerio.load(resp);
        let genres = ''
        let PremiereTime = ''
        $("span[property='v:genre']").each(function(index, element) {
            genres += $(element).text() + ";"
        });

        $("span[property='v:initialReleaseDate']").each(function(index, element) {
            PremiereTime += $(element).text()  + ";"
        });

        let urlDataId = url.match(/\/\d+/mg)[0].replace('/', '')
        let peopleinfo = await this.retry(this.GetAllPeople, {times: 10, params: [urlDataId]})

        let directors = [];
        $("span:contains(导演)+span.attrs a").each(function(index, element) {
            let info = {}
            info.name =  $(element).text() || ""
            directors.push(info)
        });
        if (peopleinfo.directors.length) {
            directors = peopleinfo.directors
        }

        let actors = [];
        if (peopleinfo.actors.length) {
            actors = peopleinfo.actors
        } else if (actorsInfoList.length){
            actors = actorsInfoList
        } else {
            $("span:contains(主演)+span.attrs a").each(function(index, element) {
                let info = {}
                info.name =  $(element).text() || ""
                actors.push(info)
            });
        }

        let screenwriters = [];
        $("span:contains(编剧)+span.attrs a").each(function(index, element) {
            let info = {}
            info.name =  $(element).text() || ""
            screenwriters.push(info)
        });
        if (peopleinfo.screenwriters.length) {
            screenwriters = peopleinfo.screenwriters
        }
        let country = ""
        let tempcountry = /制片国家\/地区:<\/span>(.+?)<br\/>/.exec(resp)
        if (tempcountry) {
            country = tempcountry[1]
        }

        let data = {
            "影片名": name,
            "链接": url,
            "制片国家/地区": country,
            "首映时间": PremiereTime,
            "主演": actors[0]['name'],
            "导演": directors[0]['name'],
            "编剧": screenwriters[0]['name'],
            "制片人": peopleinfo.moviemakers[0]['name'],
            "类型": genres,
            "剧情介绍": $("span[property='v:summary']").text().replace(/[\n\t\s]/g, '') ||  "",
        };
        let result = {
            status: 200,
            message: "success",
            data: [data],
            timestamp: timestamp
        }
        return result
    }

    /**
     * 从电影主页 movie.douban.com/subject/{url}/ 源码提取演员信息
     * @param {JSON} movieResp 电影的主页面
     */
    actorsInMovie(movieResp){
        let domain = 'https://movie.douban.com';
        let actorsInfoRegex = /json">(.*?)<\/script>/s;
        let actorsInfo = actorsInfoRegex.exec(movieResp);
        let actorsInfoList = [];
        if (actorsInfo){
            let subjectObj  = JSON.parse(actorsInfo[1].trim());
            subjectObj.actor.forEach(actor => {
                let actor_ = {};
                actor_.url = domain + actor.url;
                actor_.name = actor.name.split(' ', 1)[0];
                actor_.gender = '';
                actor_.douban_id = '';
                actor_.avatar = '';
                actor_.roleName = '';
                actorsInfoList.push(actor_)
            });
        }
        return actorsInfoList
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
            timeout:60000,
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

    static reg_search(pattern, string){
        let res = pattern.exec(string);
        if (!res){
            return "";
        }else {
            return res[1];
        }
    }
}
