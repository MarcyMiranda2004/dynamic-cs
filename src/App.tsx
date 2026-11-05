import { Route, Routes } from 'react-router-dom'
import ThemeToggle from '@/components/common/theme/ThemeToggle'
import NotFoundPage from './components/pages/NotFoundPage'
import HomePage from '@/components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'
import CyberpunkRedCharacterSheet from '@/sheets/cyberpunkRed/CyberpunkRedCharacterSheet'
import CallOfCthulhuCharacterSheet from '@/sheets/callOfCthulhu/CallOfCthulhuCharacterSheet'
import SeventhSeaCharacterSheet from '@/sheets/seventhSea/SeventhSeaCharacterSheet'
import VampireTheMasqueradeCharacterSheet from '@/sheets/vampireTheMasquerade/VampireTheMasqueradeCharacterSheet'
import DungeonsAndDragonsCharacterSheet from '@/sheets/dungeonsAndDragons/DungeonsAndDragonsCharacterSheet'
import PathfinderCharacterSheet from '@/sheets/pathfinder/PathfinderCharacterSheet'

function App() {

  return (
    <main className='dcs-main-container'>
      {/* <ThemeToggle /> */}
      <Routes>
        <Route path='*' element={<NotFoundPage />} />
        <Route path='/' element={<HomePage />} />

        <Route path='login' element={<LoginPage />} />
        
        <Route path="sheets">
          <Route path='cyberpunk-red' element={<CyberpunkRedCharacterSheet />} />
          <Route path='call-of-chtulhu-7e' element={<CallOfCthulhuCharacterSheet />} />
          <Route path='7th-sea-3e' element={<SeventhSeaCharacterSheet />} />
          <Route path='vampire-the-masquerade-6e' element={<VampireTheMasqueradeCharacterSheet />} />
          <Route path='dungeons-and-dragons-5e' element={<DungeonsAndDragonsCharacterSheet />} />
          <Route path='pathfinder-2e' element={<PathfinderCharacterSheet />} />
        </Route>
      </Routes>
    </main>
  )
}

export default App
