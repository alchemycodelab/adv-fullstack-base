import { act, render, screen, waitFor } from '@testing-library/react';
import fooListFn from './foo-list'
import {afterEach, expect, jest, describe, it} from '@jest/globals'

// TODO: Make mocking sane.
global.fetch = jest.fn((..._args: any) => {
  return (Promise.resolve({
    status: 200,
    json: (): any => {
      return Promise.resolve([{foo: 'bar'}])
    },
  }) as Promise<Response>)
})

describe('FooList', () => {
  // Can we set this globally for all tests? That would be the swellest.
  afterEach(() => {
    jest.clearAllMocks()
  })
  it('displays a list of foos from a request', async () => {
    const FooList = fooListFn()
    // When testing useEffect and other async operations, use act + waitFor like
    // in this test.
    await act(() => {
      render(
        <FooList />
      )
    })

    // We must wait for the results to come back. Because we have this
    // distinction, we can test loading UI (sans waitFor) and results (with
    // waitFor).
    await waitFor(() => {
      const el = screen.getByTestId('foo-0')
      expect(el.textContent).toEqual('bar')
    })
  })
})
