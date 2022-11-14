import {useState, useEffect} from 'react'

export default () => {
  const component = (props) => {
    const [cats, setCats ] = useState([])
    const [error, setError ] = useState(null)
    useEffect(() => {
      fetch('/api/v1/cats').then((res) => {
        return res.json().then(res.status < 400 ? setCats : setError)
      })
    }, [])
    if(cats.length > 0) {
      return <ul>
        {cats.map((cat, i) => {
          return <li key={i} data-testid={'foo-' + i}>{cat.name}</li>
        })}
      </ul>
    } else if(error != null) {
      return <span style={{color: 'red'}}>{JSON.stringify(error)}</span>
    } else {
      return <span>Loading Cats!</span>
    }
  }
  component.displayName = 'CatList'
  return component
}
