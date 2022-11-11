// Note the mismatch of import name and library name. This follows the
// documentation example.
import request from 'supertest'
import app from './app'
import {
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import db from './database.js'

describe('the server', () => {
  it('successfully gets /foos', () => {
    return request(app)
      .get('/foos')
      .then(res => expect(res.status).toBe(200))
  })

  it('serves a list of foos on GET /foos', () => {
    // A database mock example. Keep in mind it's easy to fall out of sync with
    // type safety here. In the example below, the full query is not mocked out.
    jest.spyOn(db, 'query').mockImplementation(
        jest.fn(() => {
          return Promise.resolve({
            rows: [{foo: 'bar'}],
          })
        }),
    )
    return request(app)
      .get('/foos')
      .then((res) => {
        expect(res.body).toEqual([{foo: 'bar'}])
      })
  })
})
