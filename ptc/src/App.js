import './App.css';
import Home from './pages/Home';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import Plans from './pages/Plans';
import Earn from './pages/Earn';
import SurveyPage from './pages/SurveyPage';
import BlogPage from './pages/BlogPage';
import AdvertisePage from './pages/AdvertisePage';
import Contact from './pages/Contact';
import Dashboard from './pages/dashboard/Dashboard';
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
          <Route path='/surveys' element={<SurveyPage/>}  />
          <Route path='/blog' element={<BlogPage/>}/>
          <Route path='/advertise' element={<AdvertisePage/>}/>
          <Route path='/contact' element={<Contact/>}/>
          <Route path='/dashboard' element={<Dashboard/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
