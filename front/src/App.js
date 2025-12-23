import './App.css';
import ConnectionInscription from './components/connection_inscription/Connection_inscription.jsx';
import Footer from './components/footer/Footer.jsx';
import Header from './components/header/Header.jsx';
import Home from './components/home/Home.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Prevision from './components/prevision/Prevision.jsx';
import DashBoard from './components/admin/DashBoard.jsx';
import GestionUserModo from './components/admin/GestionUserModo.jsx';
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
