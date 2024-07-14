import './App.css';
import 'react-toastify/dist/ReactToastify.css';
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
import AllAds from './pages/dashboard/AllAds';
import AllRequests from './pages/dashboard/AllRequests';
import AllUsers from './pages/dashboard/AllUsers';
import ApprovedRequests from './pages/dashboard/ApprovedRequests';
import ProfilePage from './pages/ProfilePage';
import WithdrawPage from './pages/WithdrawPage';
import AllMessages from './pages/dashboard/AllMessges';
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
          <Route path='/profile' element={<ProfilePage/>} />
          <Route path='/dashboard' element={<Dashboard/>} />
          <Route path='/all-ads' element={<AllAds/>} />
          <Route path='/all-users' element={<AllUsers/>} />
          <Route path='/all-requests' element={<AllRequests/>} />
          <Route path='/approved' element={<ApprovedRequests/>} />
          <Route path='/withdraw' element={<WithdrawPage/>} /> 
          <Route path='/messages' element={<AllMessages/>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
