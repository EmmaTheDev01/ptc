import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RegistartionForm from './pages/Register';
import Login from './pages/Login';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path='/' element={<Home/>}/>
          <Route path='/register' element={<RegistartionForm/>}/>
          <Route path='/login' element={<Login/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
