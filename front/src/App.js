import './App.css';
import ConnectionInscription from './components/connection_inscription/connection_inscription.js';
import Footer from './components/footer/Footer.js';
import Header from './components/header/header.js';
import Home from './components/home/Home.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Prevision from './components/prevision/Prevision.js';
import DashBoard from './components/admin/dashBoard.js';
import GestionUserModo from './components/admin/gestionUserModo.js';
function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
  useEffect(() => {
    // 1. On lit le cookie avec js-cookie
    const userCookie = Cookies.get('user_infos');

    if (userCookie) {
      // 2. Si le cookie est là, on le parse et on restaure la session
      const userObj = JSON.parse(userCookie);

      if (userObj.role === 1) {
        setIsAdmin(true)
      } else {
        setIsAdmin(false)
      }
      setCurrentUser(userObj);
      setIsConnected(true);
    }
  }, []);
  return (

    <div className="App">
      <BrowserRouter>
        <Header isConnected={isConnected} user={currentUser} setIsConnected={setIsConnected} isAdmin={isAdmin} setIsAdmin={setIsAdmin} />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<ConnectionInscription setIsConnected={setIsConnected} />}></Route>
          <Route path='/prevision' element={<Prevision />}></Route>
          <Route path='/prevision/:ville' element={<Prevision />}></Route>
          <Route path='/admin/dashboard' element={<DashBoard />} ></Route>
          <Route path='/admin/dashboard/:role' element={<GestionUserModo />} ></Route>

        </Routes>
        <Footer />
      </BrowserRouter>


    </div >

  );
}

export default App;
