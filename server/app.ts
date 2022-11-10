import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'
import path from 'node:path'
import fooController from './foos.js'

dotenv.config()

const app = express()

const server = app.listen(parseInt(process.env.PORT || '7890'), () => {
  console.log('Started server on ', server.address())
})

const prefixRouter = express.Router()
// Think of the poor foos.
prefixRouter.use('/foos', fooController)

app.use(process.env.API_PREFIX || '', prefixRouter)
// Ordinarily we'd use __dirname as a base directory, but issues that arise from
// https://github.com/kulshekhar/ts-jest/issues/1174 cause problems with not
// being able to use import.meta.url (our module equivalent of __dirname). Our
// settings are covered according to the various guides. Using $PWD (what
// process.cwd() returns) may not be safe in all occasions, but should be good
// enough since we control the deployment context.
const publicDir = path.join(process.cwd(), 'public')
app.use(express.static(publicDir))

// Sending our index.html to the client on a 404 is required to make HTML5
// routes. HTML5 routes are the routes using the paths instead of the
// fake paths after the anchor (#) in the URL.
app.all('*', (req: Request, res: Response) => {
  res.status(404).sendFile(path.join(publicDir, 'index.html'))
})

export default server

