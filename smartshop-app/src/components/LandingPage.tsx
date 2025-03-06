import { Button, Typography } from '@mui/joy';
import { ProductCard } from './ProductCard';
import { useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../store/auth';
import { Product } from '../store/store';
import { useState } from 'react';
import ImageCarousel from './ImageCarousel';

const LandingPage = () => {

    const [products, setProducts] = useState<Product[]>([])
    async function loadProducts() {

        
        console.log(`Bearer ${getAccessToken()}`)

        try{
            console.log({
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${getAccessToken()}`
            })
            let productRequest = await axios.get("http://localhost:8080/rest/api/1/producto/all", {
                headers: {
                    "Authorization": `Bearer ${getAccessToken()}`
                }
            })
            
            console.log(productRequest.status)
            if (productRequest.status !== 200) {
                console.log("Error fetching products")
                return
            }
    
            console.log(productRequest.data)
            setProducts(productRequest.data)
            console.log("Products loaded")
        }catch(error){
            console.log("Error fetching products")
            console.log(error)
            return
        }
        // Fetch products from API

        
    }

    useEffect(() => {
        Promise.all([loadProducts()])   
    }, [])

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-blue-600 text-white p-6 text-center">
                <Typography level="h3" sx={{ color: "white" }}>Compara miles de productos y sus precios, y toma la mejor decision</Typography>
                <Typography level="body-lg" sx={{ color: "white" }}>Configura tu lista</Typography>
                <Button variant="solid" color="primary" className="mt-4">Compara ahora</Button>
            </header>
            
            <br />
            <div className='w-full p-4 bg-white shadow-lg flex flex-col '>
                <Typography level="h2" className="text-center mt-4">Top Productos</Typography>
                <section className="flex justify-center items-center flex-wrap gap-y-2 gap-x-2 mt-4">
                    {
                        products.slice(0,5).map((product: Product) => <ProductCard id={product.id} name={product.name} description={product.description} price={product.price} key={product.id} />)
                    }
                </section>
            </div>

            <div className='flex flex-col my-10 gap-10'>
                <div>
                    <Typography level="h1" className="text-center mt-4">Todo lo que necesites en un solo lugar</Typography>
                </div>
                <section>
                    <ImageCarousel />
                </section>
                <div>
                    <Typography level="h1" className="text-center mt-4">Las mejores marcas y proveedores a tu disposicion</Typography>
                </div>
            </div>

            {/* Footer */}  

        </div>
    );
};

export default LandingPage;
