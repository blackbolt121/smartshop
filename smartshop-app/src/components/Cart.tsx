import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store/store";
import { clearCart } from "../store/cartSlice";
import { Button, Typography } from "@mui/joy";
import { CartItem } from "../store/cartSlice";
import { getAccessToken } from "../store/auth";
import { useNavigate } from "react-router-dom";
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import CartItemCard from "./CartItemCard";
import Payment from "./Payment";
import { useRef } from "react";
interface AmountTokenizationRequest {
  "clientId": number,
  "storeId": number,
  "tokenAmount": string,
  "amount": number
}



const Cart = () => {
  const loaded = useRef(false)
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);
  const [token, setToken] = useState("")

  const loadToken = () => {
    const price = cartItems.reduce((value: number, item: CartItem) => (item.price * item.quantity) + value, 0)
    const payload = {
      amount: price
    }
    fetch(`https://gateway-154.netpaydev.com/gateway-ecommerce/v3/token/amount`, {
      headers: {
        "Authorization": "sk_netpay_VcNiErfSqYMnxOZToQxxNYLFORdUHJZpyeFeZFoGsccny",
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      method: "POST",
      body: JSON.stringify(payload)
    })
      .then(res => res.json())
      .then((res: AmountTokenizationRequest) => {
        console.log(res)
        setToken(res.tokenAmount)
      })
  }
  useEffect(() => {
    const path = location.pathname;
    if (getAccessToken() === null && path.startsWith("/cart")) {
      navigate("/login");
    }
    loadToken()
    
  }, []);
  useEffect(()=>{
    if(token.length > 0 && window.NetPay){
      window.NetPay.init("pk_netpay_JGFtQNUFIENMlhkoBXdgiozmQ")
      window.NetPay.setSandboxMode(true)
      loaded.current = true
    }
  }, [token])
  useEffect(() => {
    // Definir funciones globales para NetPay
    setToken("")
    loadToken()
    
  }, [cartItems]);

  const handleClearCart = () => {
    dispatch(clearCart());
  };

  return (
    <div className="container mx-auto p-4 mt-16">
      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-96 text-gray-500">
          <ShoppingCartOutlinedIcon style={{ fontSize: 80 }} className="text-red-600" />
          <Typography level="h2" className="mt-4">Tu carrito está vacío</Typography>
          <Typography level="body-lg">Agrega productos para verlos aquí.</Typography>
        </div>
      ) : (
        <>

          <div className="space-y-4">
            {cartItems.map((item) => (
              <CartItemCard id={item.id} quantity={item.quantity} key={item.id} />
            ))}
          </div>

          <div className="mt-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pt-4 px-2">
            <h2 className="text-xl font-semibold text-gray-800">
              Total:&nbsp;
              {cartItems
                .reduce((total: number, item: CartItem) => total + item.price * item.quantity, 0)
                .toLocaleString("es-MX", {
                  style: "currency",
                  currency: "MXN",
                })}
            </h2>

            <div className="flex gap-2">
              <button
                onClick={handleClearCart}
                className="px-4 py-2 text-sm font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
              >
                Vaciar carrito
              </button>

              {token.length > 0 ? <Payment token={token} count={cartItems.length} /> : <Button loading />}
            </div>

          </div>

        </>
      )}
    </div>
  );
};

export default Cart;
