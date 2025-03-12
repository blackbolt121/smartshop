import './App.css'
import {Route, Routes, useNavigate} from "react-router-dom";
import { Home } from './components/home/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import Navbar from './components/NavBar';
import { Typography } from '@mui/joy';
import {Admin} from './components/Admin';
import { ProductsAdmin } from './components/AdminComponents/ProductsAdmin';
import { VendorsAdmin } from './components/AdminComponents/VendorsAdmin';
import About from './components/About';
import ContactPage from './components/ContactPage';
import { getAccessToken } from './store/auth';
import { useEffect } from 'react';
import { Tienda } from './components/Tienda/Tienda';
import { Footer } from './components/Footer';
import { ProductPage } from './components/Product/ProductPage';

function App() {

  const navigate = useNavigate()


  useEffect(() => {
    console.log(getAccessToken())
    if(getAccessToken() === null){
      if(!(location.href.includes("login") || location.href.includes("signup"))){
        navigate("/login")
      }
    }

  }, [getAccessToken()])

  return (
    <>
      <div className='min-h-screen'>
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
            <Route path='/about' element={<div><About /></div>} />
            <Route path='/contact' element={<div><ContactPage /></div>} />
            <Route path='/tienda' element={<Tienda />} />
            <Route path='/producto/:id' element={<ProductPage />} />
            <Route path='*' element={<Typography>404 Not Found</Typography>} />

        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
