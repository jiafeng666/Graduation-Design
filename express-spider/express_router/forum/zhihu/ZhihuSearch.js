const axios = require('axios').default;

let cookie = '_zap=4b96c234-5e69-4c6c-9d6d-e056eec0b2a1; _xsrf=VhQhUZH5HkstG6dgYj3tzOp1A2aHNGSd; d_c0="AJBR_vHwKxSPTgPIQdwkXFK1jLU9oYF42wY=|1639326227"; __snaker__id=NTNkie9hapKj7QY7; gdxidpyhxdE=mNv0QYCEeCrX54/VRu7g2agNTlG16zMJ0pCMNkY3lyZfWNw60siuxsjGDkDEJwMJHujfvzatOXVDIoGiidxv7vHvqgZHwHwH4DqoDgk/\wmh3ChNv5IVJuaZEdTyX5xBU1Xq1NOfrJ1ottHVEqOjZ1RT5XAzpvgjqTU8rX2OSv3L4TR0:1639327235395; _9755xjdesxxd_=32; YD00517437729195:WM_NI=q03K4DnaDwV3xiV6wngRPloGE66We8aZaCATkxIsl8ZD8CCEVNh/zmGINR8kAfoyFUURzSW/iSaWQbtVdP7xVkgf8gr6Kr4pO3679jMMA5jV46SBV+PBhKPDNwFS/1txZlI=; YD00517437729195:WM_NIKE=9ca17ae2e6ffcda170e2e6ee95d56885efb78fd13eaaac8eb3d55b878f9aabaa34b1eebab1fc67b08d8991e82af0fea7c3b92ab3f0fdacb750aebf8c98d539bcb79ad7f666a58ea08dee4d87eafab8e834a386afa4c460a9a88794ef349a9cf8a4c24f9692a8d0f967859782b3bb6183baa19ac55f978eb6b4d625ab8dafb8d46ab88aacb1b67496b5a987bb6db2ea8593b77c8dedfad8bc628f938fd6e95ef8ea9da3d521949ea8acd3508ea98ab4ae3bb8a8968dcc37e2a3; YD00517437729195:WM_TID=CJBxOvQmujdBFERAAVJut4jveinkTXoL; z_c0="2|1:0|10:1639326353|4:z_c0|92:Mi4xOHlHUkNnQUFBQUFBa0ZILThmQXJGQ1lBQUFCZ0FsVk5rWENqWWdBZzVTbmREMUViWXhrWUJXbzV3Z1BJSFowbGJB|8f863c6e7b7a18d76c00b8c1464a853af01c70f08ae15d9cd9ddb1936fb8aa59"; q_c1=a232a5ea13634a45a12ee1fc3def7a4b|1645448747000|1645448747000; Hm_lvt_98beee57fd2ef70ccdd5ca52b9740c49=1650768072,1651062487,1651421490,1651499370; SESSIONID=nTPu5N1Ibre9yGObmPN7LBV2MWQkPBnUkcWqfwl0H3K; JOID=Vl0QC0lnPUN90pjmYmt6EuCPZcp3CGkeAuHX1yYDTiZJodmoAM7XKxPVmetlpCJk8e1cq4eYHqQvtYcK2gdv-Qs=; osd=UVoSAUpgOkF30Z_hYGF5FeeNb8lwD2sUAebQ1SwASSFLq9qvB8zdKBTSm-FmoyVm--5brIWSHaMot40J3QBt8wg=; NOT_UNREGISTER_WAITING=1; Hm_lpvt_98beee57fd2ef70ccdd5ca52b9740c49=1651505577; KLBRSID=c450def82e5863a200934bb67541d696|1651505847|1651499367'

module.exports = class ZhihuSearchSpider{
    async crawlSearchEntrypoint(keyword) {
        let timestamp = Math.floor(Date.now()/1000);
        let datalist = []
        const resp = await axios.get('https://www.zhihu.com/api/v4/search_v3', {
            params: {
                't': 'general',
                'q': `${keyword}`,
                'correction': '1',
                'offset': '0',
                'limit': '20',
                'filter_fields': '',
                'lc_idx': '0',
                'show_all_topics': '0',
                'search_source': 'Normal'
            },
            headers: {
                'authority': 'www.zhihu.com',
                'accept': '*/*',
                'accept-language': 'zh-CN,zh;q=0.9,en-CN;q=0.8,en;q=0.7',
                'cookie': cookie,
                'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/100.0.4896.60 Safari/537.36',
                'x-ab-param': 'tp_zrec=1;top_test_4_liguangyi=1;se_ffzx_jushen1=0;tp_topic_style=0;pf_noti_entry_num=2;qap_question_author=0;tp_contents=2;qap_question_visitor= 0;tp_dingyue_video=0;pf_adjust=0',
                'x-ab-pb': 'CpQCngVUCaMJaQGLBREFZwjFCQ8LoAOhA6YG3AcWCVYMogZgC7kCyQnPC9EJBgr2AnYIxQgBCXQBzAJQA08KJwdPA6sJNww7ApEJ9APaCEIJUgtWBRYGEgkECgEL4wWbB5gIMQaUBuQK5wVBBkkKdwdsCKYE6QTGCSoG6wZ5CGoBogNgCcMJxwkbAIQCKQWyB+UIQAF9AgEGhAnhCXoIjQl1CY0EVQnXCzIDSQnYArcD9AlhCbQKKgPzA1IF7ArlCd0HQwBHACcJKwo0DLQAJwj0C1EF2Ac/AMgJPwY/CeALVwR0CNYI1wIwBosJ9gm1C4wEVweJCMwJ3AuMBcoJ4AmbCzIFTwd4B8sJMwTWBPEJMwXECQcKEooBAQAAAQAABAABAAAAAgABAwAVAAsAAAAABgAAAAAAAAABAQEBAAAAAQAAAAAAAAEDAAAAAAAAAAAAAAAAAAAAAAIAAAIAAAABAQEHAAACAAAEAAAAAQAAAAAAAgAEAQACFQAAAAAAAAABAAAAAAAAAQAAAAAAAAMEAQAAAAAAAAIBAAAAAAQAAAAA',
                'x-api-version': '3.0.91',
                'x-app-za': 'OS=Web',
                'x-requested-with': 'fetch',
                'x-zse-93': '101_3_2.0',
                'x-zse-96': '2.0_aLOygJLBHGtpUCSqZwtyk49yQTtfNGFBGMtqrHuq2T2Y'
            }
        });
        var answers = resp.data.data
        for (var i = 0; i<answers.length; i++) {
            try{
                var answer = answers[i];
                var type = answer['type'];
                var title_ = answer['highlight']['title'];
                var title = title_ ? title_.replaceAll('<em>', '').replaceAll('</em>', '') : '';
                var url = answer['object']['url'] || answer['object']['video_url'];
                var author = answer['object']['author']['name'];
                var author_url = answer['object']['author']['url']
                var pubtime_ = answer['object']['created_at'] || answer['object']['created_time'];
                var pubtime = this.parseTime(pubtime_)
                var description_ = answer['highlight']['description'];
                var description = description_ ? description_.replaceAll('<em>', '').replaceAll('</em>', '') : ''

                var data = {
                    关键词: keyword,
                    标题: title,
                    链接: url,
                    类型: type,
                    答主: author,
                    答主主页: author_url,
                    发布时间: pubtime,
                    导语: description
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

    parseTime(time) {
        if (typeof time === 'number') {
            return new Date(time * 1000).toLocaleString('zh-CN', { hour12: false, timeZone: 'Asia/Shanghai' });
        }
        return '';
    }
};
