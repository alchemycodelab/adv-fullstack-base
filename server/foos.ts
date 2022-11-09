import { type Express, type Request, type Response, Router } from 'express'
import db from './database.js'
import { type Foo } from '../common/foo.js'
import { type QueryResult } from 'pg'


export default Router()
  .get('/', (req: Request, res: Response) => {
    return db.query('select * from foos;')
      .then((result: QueryResult<Foo>) => res.send(result.rows))
  })
