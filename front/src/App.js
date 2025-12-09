import './App.css';
import ConnectionInscription from './components/connection_inscription/connection_inscription.js';
import Footer from './components/footer/Footer.js';
import Header from './components/header/header.js';
import Home from './components/home/Home.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Prevision from './components/prevision/Prevision.js';

function App() {
  const [isConnected, setIsConnected] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    // 1. On lit le cookie avec js-cookie
    const userCookie = Cookies.get('user_infos');

    if (userCookie) {
      // 2. Si le cookie est là, on le parse et on restaure la session
      const userObj = JSON.parse(userCookie);
      setCurrentUser(userObj);
      setIsConnected(true);
    }
  }, []);
  return (

    <div className="App">
      <BrowserRouter>
        <Header isConnected={isConnected} user={currentUser} setIsConnected={setIsConnected} />
        <Routes>

          <Route path="/" element={<Home />} />
          <Route path="/connexion" element={<ConnectionInscription setIsConnected={setIsConnected} />}></Route>
          <Route path='/prevision' element={<Prevision />}></Route>
          <Route path='/prevision/:ville' element={<Prevision />}></Route>
        </Routes>
        <Footer />
      </BrowserRouter>


    </div>

  );
}

export default App;
