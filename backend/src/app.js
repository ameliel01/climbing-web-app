// Patches
const { inject, errorHandler } = require('express-custom-error')
inject()

// Dependencies
const express = require('express')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const helmet = require('helmet')
const logger = require('./util/logger')

const app = express()

// Middleware CORS : autorise toutes les origines (dev seulement !)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware CORS : autorise toutes les origines (dev seulement !)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Swagger EN TÊTE POUR NE PAS ÊTRE INTERCEPTÉ PAR LE STATIC
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')  // <= ajuste bien ici le chemin
console.log("Swagger loaded on /doc");
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile))

// Middlewares classiques
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(logger.dev, logger.combined)
app.use(cors())
app.use(cookieParser())
app.use(helmet())


// Assign Routes
app.use('/api', require('./routes/router.js'))

// Jobs + error handler
// require('./jobs/syncUser.js')
app.use(errorHandler())

// PROXY React après tout le reste
if (process.env.PROXYREACT) {
  const { createProxyMiddleware } = require('http-proxy-middleware')
  const reactProxy = createProxyMiddleware({
    target: 'http://localhost:5173/',
    changeOrigin: true,
    ws: true
  })
  app.use('/', reactProxy)
}

// Static frontend
app.use('/', express.static('../frontend/dist'))
app.use('/', express.static('../frontend/public'))
app.use('/', express.static('./src/frontend'))

// 404 global
app.use('*', (req, res) => {
  res.status(404).json({ status: false, message: 'Endpoint Not Found' })
})

module.exports = app
