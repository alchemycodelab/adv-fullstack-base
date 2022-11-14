import { type Request, type Response, Router } from 'express'
import db from '../database.js'
import { type Foo } from '../../common/foo.js'
import { type QueryResult } from 'pg'


export default Router()
  .get('/', (req: Request, res: Response) => {
    return db.query('select * from foos;')
      .then((result: QueryResult<Foo>) => res.send(result.rows))
  })
  .delete('/:id', (req: Request, res: Response) => {
    if(req.params.id != null && Number.isInteger(parseInt(req.params.id))) {
      return db.query('delete from foos where foos.id = ?', [req.params.id])
        .then(() => res.status(201))
    } else {
      console.error(
        `id to delete is not a valid id: ${JSON.stringify(req.params.id)}`,
      )
      res.status(400)
    }
  })
