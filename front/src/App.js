import './App.css';
import Footer from './components/footer/Footer.js';
import Header from './components/header/header.js';
import Home from './components/home/Home.js';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (

    <div className="App">
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
        </Routes>
        <Footer />
      </BrowserRouter>


    </div>

  );
}

export default App;
