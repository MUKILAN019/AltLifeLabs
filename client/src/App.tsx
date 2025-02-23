import Home from "./pages/home";
import Login from "./pages/auth/signin";
import SignUp from "./pages/auth/signup";
import { BrowserRouter as Router, Routes,Route } from "react-router-dom";
import Status from "./pages/status";
import ProtectedRoute from './components/ProtectedRoute';
import Pending from "./components/pending";
const App: React.FC = () =>{
      return(
        <Router>
          <Routes>
            <Route path='/' element={<Login/>}/>
            <Route path='/register' element={<SignUp/>}/>
            <Route path='/home' element={
              <ProtectedRoute>
                <Home/>
                </ProtectedRoute>}/>
            <Route path='/status' element={<ProtectedRoute>
              <Status/>
              </ProtectedRoute>}/>
            <Route path='/pending' element={<ProtectedRoute>
              <Pending/>
            </ProtectedRoute>}/>
          </Routes>
        </Router>
      )
}

export default App;