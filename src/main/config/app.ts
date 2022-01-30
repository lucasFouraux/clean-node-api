import setupMiddlwares from './middlewares'
import setupRoutes from './routes'
import setupStaticFiles from './statis-files'
import setupSwagger from './config-swagger'
import express from 'express'

const app = express()
setupStaticFiles(app)
setupSwagger(app)
setupMiddlwares(app)
setupRoutes(app)
export default app
