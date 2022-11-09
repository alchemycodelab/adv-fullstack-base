import {
  type FC,
  type ReactElement,
  useState,
  useEffect,
} from 'react'
import { type Foo } from '../../common/foo.js'

export type Props = {}

export type Component = FC<Props>

export default (): FC<Props> => {
  const component = (props: Props): ReactElement => {
    // Simply accepting the type we get from the server is inherently dangerous,
    // but for the simplicity of the example we will forego validation.
    const [foos, setFoos ] = useState<ReadonlyArray<Foo>>([])
    const [error, setError ] = useState<{} | null>(null)
    useEffect(() => {
      fetch('/api/v1/foos').then((res) => {
        return res.json().then(res.status < 400 ? setFoos : setError)
      })
    }, [])
    if(foos.length > 0) {
      return <ul>
        {foos.map((foo, i) => {
          return <li key={i} data-testid={'foo-' + i}>{foo.foo}</li>
        })}
      </ul>
    } else if(error != null) {
      return <span style={{color: 'red'}}>{JSON.stringify(error)}</span>
    } else {
      return <span>Loading Foos!</span>
    }
  }
  component.displayName = 'Foolist'
  return component
}
