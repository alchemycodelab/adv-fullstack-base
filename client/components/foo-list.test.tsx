import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from '@testing-library/react';
import fooListFn from './foo-list'
import {afterEach, expect, jest, describe, it} from '@jest/globals'
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import { mockFetch } from '../mock-fetch'

describe('FooList', () => {
  // Can we set this globally for all tests? That would be the swellest.
  afterEach(() => {
    jest.clearAllMocks()
  })

  it('displays multiple foos on /foos', async () => {
    mockFetch(200, [{id: 0, foo: 'bar'}, {id: '1', foo: 'qux'}])
    const FooList = fooListFn()
    act(() => {
      render(<FooList/>)
    })
    await waitFor(() => {
      const el = screen.getByTestId('foo-1')
      expect(el.textContent).toEqual('qux')
    })
  })

  it('can edit a foo name (edit mode)', async () => {
    mockFetch(200, [{id: '0', foo: 'bar'}])
    const FooList = fooListFn()
    await act(async () => {
      render(<FooList/>)
    })
    await act(() => {
      const editButton = screen.getByTestId('foo-edit-0')
      fireEvent(
        editButton,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })
    await waitFor(async () => {
      const editTextField = screen.getByTestId<HTMLInputElement>('foo-edit-text-0')
      expect(editTextField.value).toEqual('bar')
    })
  })

  it.only('can edit a foo name (edit text)', async () => {
    mockFetch(200, [{id: '0', foo: 'bar'}])
    const FooList = fooListFn()
    await act(async () => {
      render(<FooList/>)
    })
    await act(() => {
      const editButton = screen.getByTestId('foo-edit-0')
      fireEvent(
        editButton,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })
    await act(() => {
      const editTextField = screen.getByTestId<HTMLInputElement>('foo-edit-text-0')
      fireEvent.change(
        editTextField,
        { target: { value: 'new name' } },
      )
    })
    await waitFor(async () => {
      const editTextField = screen.getByTestId<HTMLInputElement>('foo-edit-text-0')
      expect(editTextField.value).toEqual('new name')
    })
  })

  it('displays a list of foos from a request', async () => {
    mockFetch(200, [{id: 0, foo: 'bar'}])
    const FooList = fooListFn()
    // When testing useEffect and other async operations, use act + waitFor like
    // in this test.
    act(() => {
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

  it('deletes a foo and removes it from display', async () => {
    const FooList = fooListFn()
    // When testing useEffect and other async operations, use act + waitFor like
    // in this test.
    await act(async () => {
      render(
        <FooList />
      )
    })
    await act(() => {
      mockFetch(200, [])
      const deleteButton = screen.getByText('delete')
      fireEvent(
        deleteButton,
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })
    // We must wait for the results to come back. Because we have this
    // distinction, we can test loading UI (sans waitFor) and results (with
    // waitFor).
    await waitFor(async () => {
      // The toBeInTheDocument matcher doesn't work with TypeScript, even though
      // it is documented here:
      // https://testing-library.com/docs/guide-disappearance/#nottobeinthedocument
      //
      // Bugs are reported in lots of places, but one such as this can be found
      // about it: https://github.com/testing-library/jest-dom/issues/442
      //
      // This seems to be something that jest-dom and friends are somewhat aware
      // of but even with minimal reproductions, the problem doesn't seem to be
      // well understood. There's also the possibility of version-mismatches
      // between the type definitions and the library itself. Node.js project
      // configurations are so incredibly bespoke that it's hard for them to
      // narrow it down.
      expect(screen.queryByTestId('foo-0')).toBeNull()
    })
  })

})
