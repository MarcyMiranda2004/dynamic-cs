import { Link, Route, Routes } from 'react-router-dom'
import HomePage from '@/components/pages/HomePage'
import CyberpunkRedCharacterSheet from '@/sheets/cyberpunkrRed/CyberpunkRedCharacterSheet'
import ThemeToggle from '@/components/common/ThemeToggle'

function App() {

  return (
    <main className='dcs-main-container'>
      <ThemeToggle />
      <Routes>
        <Route path='/' element={<HomePage />} />

        <Route path="sheets">
          <Route path='cyberpunk-red' element={<CyberpunkRedCharacterSheet />} />
        </Route>

        {/* Senza questa rotta un URL sbagliato mostrava solo una pagina vuota */}
        <Route
          path='*'
          element={
            <div className='grid gap-3 p-6 text-center'>
              <p className='m-0'>Pagina non trovata.</p>
              <Link to='/' className='underline'>Torna alla home</Link>
            </div>
          }
        />
      </Routes>
    </main>
  )
}

export default App
