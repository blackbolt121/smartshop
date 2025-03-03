import './App.css'
import {Route, Routes} from "react-router-dom";
import { Home } from './components/home/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/NavBar';
import { Typography } from '@mui/joy';
import {Admin} from './components/Admin';
import { ProductsAdmin } from './components/AdminComponents/ProductsAdmin';
import { VendorsAdmin } from './components/AdminComponents/VendorsAdmin';

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
            <Route path='/admin' element={<Admin />} />
            <Route path='/admin/products' element={<ProductsAdmin />} />
            <Route path='/admin/vendors' element={<VendorsAdmin />} />
            <Route path='*' element={<Typography>404 Not Found</Typography>} />

        </Routes>
      </div>
    </>
  )
}

export default App
