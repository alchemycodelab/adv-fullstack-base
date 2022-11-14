import {
  type FC,
  type ReactElement,
  useState,
  useEffect,
} from 'react'
import { deleteFoo, getFoos, updateFoo } from '../services/foos'
import buttonFn from './button'
import buttonStyles from './button.module.css'
import listItemFn from './list-item'
import listItemStyles from './list-item.module.css'
import { type Foo } from '../../common/foo.js'
import fooListItemFn from './foo-list-item'

export type Props = {}

export type Component = FC<Props>

export default (): FC<Props> => {
  const ListItem = listItemFn(listItemStyles.foo)
  const CancelButton = buttonFn(buttonStyles.removeListItem)
  const EditButton = buttonFn(buttonStyles.editListItem)
  const DeleteButton = buttonFn(buttonStyles.removeListItem)
  const SaveButton = buttonFn(buttonStyles.updateListItem)
  const FooListItem = fooListItemFn(
    CancelButton,
    SaveButton,
    EditButton,
    DeleteButton,
    ListItem,
  )
  const component = (props: Props): ReactElement => {
    // Simply accepting the type we get from the server is inherently dangerous,
    // but for the simplicity of the example we will forego validation.
    const [foos, setFoos ] = useState<ReadonlyArray<Foo>>([])
    const [loadingFoos, setLoadingFoos] = useState(false)
    const [error, setError ] = useState<{} | null>(null)
    const loadFoos = () => {
      setLoadingFoos(true)
      getFoos()
        .then(res => (res.status < 400 ? setFoos : setError)(res.json))
        .finally(() => setLoadingFoos(false))
    }
    useEffect(() => {
      loadFoos()
    }, [])
    if(foos.length > 0) {
      return <ul>
        {foos.map((foo) => {
          return <FooListItem
            key={foo.id}
            foo={foo}
            onDelete={() => deleteFoo(foo.id).then(loadFoos)}
            onUpdate={(updated: Foo) => updateFoo(updated).then(loadFoos)}
          />
        })}
      </ul>
    } else if(error != null) {
      return <span style={{color: 'red'}}>{JSON.stringify(error)}</span>
    } else if(!loadingFoos) {
      return <span>No Foos found!</span>
    } else {
      return <span>Loading Foos!</span>
    }
  }
  component.displayName = 'FooList'
  return component
}
