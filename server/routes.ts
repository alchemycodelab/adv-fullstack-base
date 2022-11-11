/*******************************************************************************
 * Routes here belong to the API. All routes here assume API_PREFIX. In local
 * development, this is assumed to be /api/v1. See the Webpack configuration
 * (webpack.config.js) for the re-writes to accomplish that.
 *
 * Since API_PREFIX adds the /api/v1, you needn't do it here in your routes.
 ******************************************************************************/

import express, { type Router } from 'express'
import fooController from './foos.js'


export default (): Router => {
  const prefixRouter = express.Router()
  // Think of the poor foos.
  prefixRouter.use('/foos', fooController)

  return prefixRouter
}
