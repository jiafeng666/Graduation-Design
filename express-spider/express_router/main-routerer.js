const express = require('express')
const cors = require('cors')

const forum_router = require('./forum/forum-router')
const news_router = require('./news/news-router')
const shop_router = require('./shop/shop-router')
const blog_router = require('./blog/blog-router')
const house_router = require('./house/house-router')

var app = express()
app.use(cors())  // 解决接口跨域问题

app.use(forum_router)
app.use(news_router)
app.use(shop_router)
app.use(blog_router)
app.use(house_router)

app.listen(8080, () => {
    console.log('Server running at http://127.0.0.1:8080')
})