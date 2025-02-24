import './App.css'
import {Route, Routes} from "react-router-dom";
import { Home } from './components/home/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/NavBar';
import { Typography } from '@mui/joy';

function App() {



  return (
    <>
      <div className={"h-dvh"}>
        <Navbar />
        <Routes>
            <Route path={"/"} element={<Home/>} />
            <Route path={"/explorar"} element={<>Catalogo de Productos</>} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/logout' element={<Typography>Session closed</Typography>} />
        </Routes>
      </div>
    </>
  )
}

export default App
