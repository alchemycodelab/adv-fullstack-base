// Note the mismatch of import name and library name. This follows the
// documentation example.
import request from 'supertest'
import app from './app'
import {
  afterAll,
  afterEach,
  describe,
  expect,
  it,
  jest,
} from '@jest/globals'
import db from './database.js'

describe('the server', () => {
  // Gracefully shut down the server, otherwise we see a warning from Jest.
  afterAll(() => {
    app.close()
  })

  it('successfully gets /foos', () => {
    return request(app)
      .get('/foos')
      .then(res => expect(res.status).toBe(200))
  })

  it('serves a list of foos on GET /foos', () => {
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
