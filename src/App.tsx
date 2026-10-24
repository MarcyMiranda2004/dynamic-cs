import { Route, Routes } from 'react-router-dom'
import HomePage from './components/HomePage'

function App() {

  return (
    <main className='dcs-main-container'>
      <Routes>
        <Route path='/' element={<HomePage />} />
      </Routes>
    </main>
  )
}

export default App
