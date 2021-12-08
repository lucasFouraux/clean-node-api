import setupMiddlwares from './middlewares'
import setupRoutes from './routes'
import express from 'express'

const app = express()
setupMiddlwares(app)
setupRoutes(app)

export default app
