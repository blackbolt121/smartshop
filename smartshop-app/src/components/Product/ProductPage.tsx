
import axios from "axios"
import React, { SyntheticEvent, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { getAccessToken } from "../../store/auth"
import { Product } from "../../store/store"
import logo from "../../assets/smartshop.jpg"
import { Input, Typography, CircularProgress, Button } from "@mui/joy"
import { Comments } from "../Comments/Comments"

export const ProductPage = () => {

    const { id } = useParams()

    const [product, setProduct] = useState<Product>()

    async function fetchProductDetails() {
        console.log("Hello world!!!")
        console.log(`https://localhost:8080/producto/${id}`)
        const response = await axios.get<Product>('http://localhost:8080/rest/api/1/producto/' + id, {
            headers: {
                'Content-Type': 'application/json',
                Authorization: 'Bearer ' + getAccessToken()
            }
        })

        setTimeout(() => {
            setProduct(response.data)
        }, 4000)
        /*
        const productData = await axios.get(`https://localhost:8080/producto/${id}`, {
            headers:{
                Authorization: `Bearer ${getAccessToken()}`,
                "Accept": "application/json"
            }
        })
        let temp: Product = productData.data
        setProduct(temp)
        */
    }

    useEffect(() => {
        fetchProductDetails()
    }, [id])

    const addToCart = (e: React.FormEvent<HTMLFormElement>) => {

        e.preventDefault()

        console.log("Adding to cart")

        const data = new FormData(e.target as HTMLFormElement)

        console.log(data.get("number-units"))
    }

    return <>
        {product ? <div className="grid grid-cols-[30%_70%] my-10 w-[80%] mx-auto">
            <div className="flex justify-center items-center w-full">
                <img alt="productImage" src={logo} className="w-[90%]" />
            </div>
            <div className="flex flex-col p-1">
                <Typography level="h4">
                    {product.vendor.vendorName}
                </Typography>
                <Typography level="h1">
                    {product.name}
                </Typography>
                <Typography level="body-lg">
                    {product.description}
                </Typography>

                <Typography level="h3">
                    <span className="font-extrabold">${product.price}</span>
                </Typography>
                <form className="flex flex-col flex-grow" onSubmit={addToCart}>
                    <div>
                        <input name="product-id" type="hidden" value={id} />
                        <div className="flex gap-1 items-center">
                            <Typography level="body-lg">Cantidad</Typography>
                            <Input name="number-units" type="number" defaultValue={1} />
                        </div>
                    </div>

                    {/* Ensure this div is pushed to the bottom */}
                    <div className="grid grid-rows-2 lg:w-1/4 md:1/3 sm:w-1/2  gap-0.5 mt-auto">
                        <Button type="submit" color="neutral" variant="outlined"  className="w-auto">Agregar al carrito</Button>
                        <Button type="submti" sx={{p: "0.5rem"}}>Comprar ahora</Button>
                    </div>
                </form>
            </div>


            <Comments />
        </div> : <div className="w-full h-screen flex justify-center items-center"><CircularProgress size="lg" color="primary" /></div>}

    </>
}