// Note the mismatch of import name and library name. This follows the
// documentation example.
import request from 'supertest'
// This JavaScript file imports a TypeScript file from the test suite.
import app from '../app'
import {
  describe,
  expect,
  it,
} from '@jest/globals'

describe('the server', () => {
  it('successfully gets /foos', () => {
    return request(app)
      .get('/foos')
      .then(res => expect(res.status).toBe(200))
  })

  it('serves a list of foos on GET /foos', () => {
    return request(app)
      .get('/foos')
      .then((res) => {
        expect(res.body[0]).toEqual({id: '1', foo: 'bar'})
      })
  })
})
