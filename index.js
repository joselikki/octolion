const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const boom = require('boom')
const helmet = require('helmet')

const productsRouter = require('./routes/views/products')
const productsApiRouter = require('./routes/api/products')
const authApiRouter = require('./routes/api/auth')

const { logErrors, wrapErrors, clientsErrorHandler, errorHandler } = require('./utils/middlewares/errorsHandler')
const isRequestAjaxOrApi = require('./utils/isRequestAjaxOrApi')

const { config } = require('./config')

//app init
const app = express()


//midelwares
app.use(helmet())
app.use(bodyParser.json())

// Static server files
app.use("/static", express.static(path.join(__dirname, "public")))


//view engine setup
app.set('views', path.join(__dirname,"views"))
app.set("view engine", "pug")

// routes
app.use('/products', productsRouter)
app.use("/api/products", productsApiRouter)
app.use("/api/auth", authApiRouter)

//redirect home to products 
app.get('/', (req, res)=>{
    res.redirect('/products')
})


//error page
app.use((req,res, next)=>{
    if (isRequestAjaxOrApi(req)){
        const {
            output : { statusCode, payload }
        } = boom.notFound()

        res.status(statusCode).json(payload)
    }

    res.status(404).render("404")
})

//error handlers

app.use(logErrors)
app.use(wrapErrors)
app.use(clientsErrorHandler)
app.use(errorHandler)

//Levantado server
const server = app.listen(config.port, ()=>{
    console.log(`Listening http://localhost:${server.address().port}`)
})