import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar'
import ApplyLeave from './components/ApplyLeave';
import Profile from './components/Profile';
import Dashboard from './components/Dashboard';
import { AuthProvider } from './context/AuthContext';
import LmsPage from './pages/LmsPage';


function App() {
  const activeuser = 3
  return (
    <div className="App">
     <Router>
        <AuthProvider>

          <Routes>
              <Route path='/' element={<Sidebar />} >

                  <Route path=''  exact  element={<Dashboard/>} />
                  <Route path='/applyleave' element={<ApplyLeave/>}/>
                  <Route path='/profile' element={<Profile />}/>
                  {/* <Route path='/logout' element={<LmsPage />}/> */}

              </Route> 
          </Routes>
        </AuthProvider>

     </Router>

    </div>
  );
}

export default App;
