import { Navigate, Route, Routes } from 'react-router-dom'
import NotFoundPage from './components/pages/NotFoundPage'
import HomePage from '@/components/pages/HomePage'
import LoginPage from './components/pages/LoginPage'
import AppLayout from '@/components/elements/AppLayout'
import CyberpunkRedCharacterSheet from '@/sheets/cyberpunkRed/CyberpunkRedCharacterSheet'
import CallOfCthulhuCharacterSheet from '@/sheets/callOfCthulhu/CallOfCthulhuCharacterSheet'
import SeventhSeaCharacterSheet from '@/sheets/seventhSea/SeventhSeaCharacterSheet'
import VampireTheMasqueradeCharacterSheet from '@/sheets/vampireTheMasquerade/VampireTheMasqueradeCharacterSheet'
import DungeonsAndDragonsCharacterSheet from '@/sheets/dungeonsAndDragons/DungeonsAndDragonsCharacterSheet'
import PathfinderCharacterSheet from '@/sheets/pathfinder/PathfinderCharacterSheet'
import ProfilePage from './components/pages/ProfilePage'
import SettingsPage from './components/pages/SettingsPage'
import SheetsPage from './components/pages/SheetsPage'
import CharactersPage from './components/pages/CharactersPage'
import {useGetUser} from './hooks/auth/useGetUser'

function App() {
  const user = useGetUser();

  return (
    <>
     {!user.loading && (
        <Routes>
          {/* /login resta sempre raggiungibile: dopo l'accesso la pagina deve restare montata per concludere l'animazione di uscita */}
          <Route path='login' element={<LoginPage />} />

          {/* Tutte le altre pagine stanno nella shell (sidebar a sinistra, navbar e contenuto a destra) e richiedono l'accesso */}
          <Route element={user.user ? <AppLayout user={user.user} /> : <Navigate to='/login' replace />}>
            <Route path='*' element={<NotFoundPage />} />

            <Route path='profile' element={<ProfilePage />} />
            <Route path='settings' element={<SettingsPage />} />

            <Route path='/' element={<HomePage />} />
            <Route path='characters' element={<CharactersPage />} />

            <Route path="sheets">
              <Route index element={<SheetsPage />} />
              <Route path='cyberpunk-red' element={<CyberpunkRedCharacterSheet />} />
              <Route path='call-of-cthulhu-7e' element={<CallOfCthulhuCharacterSheet />} />
              <Route path='7th-sea-3e' element={<SeventhSeaCharacterSheet />} />
              <Route path='vampire-the-masquerade-6e' element={<VampireTheMasqueradeCharacterSheet />} />
              <Route path='dungeons-and-dragons-5e' element={<DungeonsAndDragonsCharacterSheet />} />
              <Route path='pathfinder-2e' element={<PathfinderCharacterSheet />} />
            </Route>
          </Route>
        </Routes>
      )}
    </>
  )
}

export default App
