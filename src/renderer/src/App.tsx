import { Route, Routes, useNavigate } from 'react-router'
import Initial from './views/initial'
import Genshin from './views/genshin'
import Broadside from './components/broadside'
import { useEffect } from 'react'

function App(): JSX.Element {
  const navigate = useNavigate()
  useEffect(() => {
    if (window.api.is_initial()) {
      navigate('/home/genshin')
    } else {
      navigate('/initial')
    }
  }, [])
  return (
    <div className="container">
      <Routes>
        <Route path="/initial" element={<Initial />} />
        <Route path="/home" element={<Broadside />}>
          <Route path="/home/genshin" element={<Genshin />} />
        </Route>
      </Routes>
    </div>
  )
}
export default App
