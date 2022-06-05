//网易号列表页采集（通过CityID）
const request = require("request");

module.exports = class NeteaseNewsSpider {
  constructor() {
    this.datalist = [];
    this.headers = {
      "user-agent": "NewsApp/76.1 Android/7.1.2 (Xiaomi/RedN4-abbdecdc9904)",
    };
  }

  async crawlList(cityid) {
    let timestamp = Math.floor(Date.now()/1000);
    let url = `https://v6-gw.m.163.com/nc/api/v1/feed/dynamic/local-list?from=${cityid}&size=40&offset=20&fn=3&devId=opuvzpXypoOSgUm7r1%2BEhzTkt1yF624p3KtDM0zv%2F4pTdKiqocj0eExU0s49fzqe`;
    let res = await this.requestPage(url);
    let jsonData = JSON.parse(res);
    await this.extracting(cityid, jsonData);
    let result = {
      status: 200,
      message: "success",
      data: this.datalist,
      timestamp: timestamp
    }
    return result
  }

  async extracting(cityid, data) {
    if (
      !data ||
      !data.data ||
      !data.data.items ||
      !data.data.items.length
    ) {
      return 0;
    }
    let articles = Object.values(data.data.items);
    for (let article of articles) {
      if (article.docid || article.postid) {
        let parsedData = {
          城市id: cityid,
          标题: article.title || "",
          链接: `https://3g.163.com/local/article/${article.docid}.html`,
          来源: article.source || "",
          分类: article.interest || "",
          图片: article.imgsrc || "",
          发布时间: article.ptime
        };
        this.datalist.push(parsedData);
      }
    }
  }

  async requestPage(url) {
    let opt = {
      url: url,
      method: "GET",
      headers: this.headers,
    };
    let res = await this.getRequest(opt);
    return res.body;
  }

  // 定义Promise函数
  getRequest(opts) {
    return new Promise((resolve, reject) => {
      request.get(opts, function (err, response, body) {
        if (!err) {
          if (body !== "null") {
            let results = {
              body: body,
              response: response,
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
