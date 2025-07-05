import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getAccessToken } from "../../store/auth";
import { Product } from "../../store/store";
import { Input, Typography, CircularProgress, Button } from "@mui/joy";
import { Comments } from "../Comments/Comments";
import { ZoomImage } from "../ZoomImage";
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../store/store';
import Add from '@mui/icons-material/Add';


import { addToCart } from "../../store/cartSlice";
const apiUrl = import.meta.env.VITE_API_URL;
export const ProductPage = () => {
  const { id } = useParams();
  const [product, setProduct] = useState<Product>();
  const dispatch: AppDispatch = useDispatch();
  const cartItems = useSelector((state: RootState) => state.cart.items);

  useEffect(() => {
    async function fetchProductDetails() {
      try {
        console.log(`${apiUrl}/rest/api/1/producto?id=${encodeURIComponent(id || "")}`)
        const response = await axios.get<Product>(
          `${apiUrl}/rest/api/1/producto?id=${encodeURIComponent(id || "")}`,
          {
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${getAccessToken()}`
            }
          }
        );
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    }

    fetchProductDetails();
  }, [id]);

  const addToTheCart = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const data = new FormData(e.target as HTMLFormElement);
    const cartItem = {
      id: String(product?.id) || "",
      name: product?.name || "",
      price: product?.price || 0.0,
      sku: product?.sku || "",
      quantity: parseInt(data.get("number-units")?.toString() || "1")
    };

    dispatch(addToCart(cartItem));
    console.log("Cart updated:", cartItems);
  };

  return (
    <>
      {product ? (
        <div className="flex flex-col lg:flex-row gap-6 my-10 w-[90%] max-w-7xl mx-auto px-4">
          {/* Imagen del producto */}
          <div className="flex justify-center items-start lg:w-1/2">
            <ZoomImage
              src={product.imageUrl}
              alt={product.name}
              zoom={2}
              className="w-full max-w-md"
            />
          </div>

          {/* Detalles del producto */}
          <div className="flex flex-col lg:w-1/2">
            <Typography level="h4" className="text-gray-600">
              {(product.vendor)?product.vendor.vendorName : "Urrea"}
            </Typography>
            <Typography level="h1" className="font-bold text-3xl mb-2">
              {product.name}
            </Typography>
            <Typography level="body-lg" className="mb-4 text-gray-800">
              {product.description}
            </Typography>
            <Typography level="body-lg" className="mb-4 text-gray-800">
              <strong>SKU:</strong> {product.sku}
            </Typography>
            <Typography level="h2" className="text-green-600 font-semibold text-2xl mb-4">
              {product.price.toLocaleString("es-MX", { style: "currency", currency: "MXN" })}
            </Typography>

            {/* Formulario de cantidad y botones */}
            <form onSubmit={addToTheCart} className="mt-2 space-y-4">
              <input name="product-id" type="hidden" value={id} />

              <div className="flex items-center gap-3">
                <Typography>Cantidad:</Typography>
                <Input
                  name="number-units"
                  type="number"
                  defaultValue={1}
                  slotProps={{
                    input: {
                      min: 1,
                      max: 100,
                    },
                  }}
                  className="w-24"
                />
              </div>

              <div className="flex gap-4 mt-6">
                <Button startDecorator={<Add />} type="submit" color="primary" variant="solid">
                  Agregar al carrito
                </Button>
                {/* <Button variant="soft">Comprar ahora</Button> */}
              </div>
            </form>
          </div>

          {/* Comentarios */}
          <div className="w-full mt-10 lg:mt-0 lg:w-[80%] mx-auto">
            <Comments />
          </div>
        </div>
      ) : (
        <div className="flex justify-center items-center h-screen">
          <div className="text-center space-y-4">
            <CircularProgress size="lg" color="primary" />
            <Typography level="body-md">Cargando producto...</Typography>
          </div>
        </div>
      )}
    </>
  );
};
