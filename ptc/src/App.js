import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Plans from './pages/Plans';
import Earn from './pages/Earn';
function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/register' element={<RegisterPage/>}/>
          <Route path='/login' element={<LoginPage/>} />
          <Route path='/get-started' element={<Plans/>} />
          <Route path='/earn' element={<Earn/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
