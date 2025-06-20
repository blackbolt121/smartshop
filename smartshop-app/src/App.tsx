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
import Cart from './components/Cart';
import { useLocation } from 'react-router-dom';
import Logout from './components/Logout';
import { useDispatch } from "react-redux";
import { clearCart } from "./store/cartSlice";

function App() {

  const navigate = useNavigate()
  const location = useLocation()
  const dispatch = useDispatch();

  async function validateCart() {
  
      let cartId = localStorage.getItem("cartId")
  
      let flag = false
  
      if (cartId != null) {

        console.log(cartId)
        
        let createCart = await fetch(`http://localhost:8080/rest/api/1/cart/order/${cartId}`,
          {
            method: "GET",
            headers: {
              "Accept": "application/json",
              "Authorization": `Bearer ${getAccessToken()}`
            }
          }
        )
  
  
        let data = await createCart.json()
  
        let ordenPago = data.ordenPago
  
        flag = !(ordenPago === null)
  
        console.log(flag)
        console.log(ordenPago)
        if (flag) {
          dispatch(clearCart())
          localStorage.removeItem("cartId")
        }
      }else{
        console.log("No cart assigned")
      }
    }

  useEffect(() => {
    validateCart().catch()
  }, [])

  useEffect(() => {
    
    let path = location.pathname

    console.log(path)

    if(getAccessToken() === null){
      if(location.pathname.startsWith("/cart")){
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
            <Route path='/logout' element={<Logout/>} />
            <Route path='/admin' element={<Admin />} />
            <Route path='/admin/products' element={<ProductsAdmin />} />
            <Route path='/admin/vendors' element={<VendorsAdmin />} />
            <Route path='/about' element={<div><About /></div>} />
            <Route path='/contact' element={<div><ContactPage /></div>} />
            <Route path='/tienda' element={<Tienda />} />
            <Route path='/producto/:id' element={<ProductPage />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='*' element={<Typography>404 Not Found</Typography>} />

        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
