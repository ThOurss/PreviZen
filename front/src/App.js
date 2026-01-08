import './App.css';
import ConnectionInscription from './components/user/Connection_inscription.jsx';
import Footer from './components/footer/Footer.jsx';
import Header from './components/header/Header.jsx';
import Home from './components/home/Home.jsx';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Prevision from './components/prevision/Prevision.jsx';
import DashBoard from './components/admin/DashBoard.jsx';
import GestionUserModo from './components/admin/GestionUserModo.jsx';
import Profil from './components/user/Profil.jsx';
import Rgpd from './components/mention_legale/Rgpd.jsx';
import Cgu from './components/mention_legale/Cgu.jsx';
function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModerateur, setIsModerateur] = useState(false);
  useEffect(() => {

    // 1. On lit le cookie avec js-cookie
    const userCookie = Cookies.get('user_infos');

    if (userCookie) {
      // 2. Si le cookie est là, on le parse et on restaure la session
      const userObj = JSON.parse(userCookie);

      if (userObj.role === 1) {
        setIsAdmin(true)
        setIsModerateur(false)
      } else if (userObj.role === 2) {
        setIsAdmin(false)
        setIsModerateur(true)
      } else {
        setIsAdmin(false)
        setIsModerateur(false)
      }
      setCurrentUser(userObj);
      setIsConnected(true);
    }
  }, []);

  return (

    <div className="App">
      <BrowserRouter>
        <Header isConnected={isConnected} user={currentUser} setIsConnected={setIsConnected} isAdmin={isAdmin} setIsAdmin={setIsAdmin} isModerateur={isModerateur} setIsModerateur={setIsModerateur} />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<ConnectionInscription setIsConnected={setIsConnected} />}></Route>
          <Route path='/profil' element={<Profil user={currentUser} />}></Route>
          <Route path='/prevision' element={<Prevision />}></Route>
          <Route path='/prevision/:ville' element={<Prevision />}></Route>
          <Route path='/admin/dashboard' element={<DashBoard isAdmin={isAdmin} />} ></Route>
          <Route path='/admin/dashboard/:role' element={<GestionUserModo />} ></Route>
          <Route path='/rgpd' element={<Rgpd />} ></Route>
          <Route path='/cgu' element={<Cgu />} ></Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <Footer />
      </BrowserRouter>


    </div >

  );
}

export default App;
