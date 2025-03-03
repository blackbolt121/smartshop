import { Button, Typography } from '@mui/joy';
import { ProductCard } from './ProductCard';
import { useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../store/auth';
const LandingPage = () => {

    async function loadProducts() {
        console.log(`Bearer ${getAccessToken()}`)

        try{
            console.log({
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${getAccessToken()}`
            })
            let productRequest = await axios.get("http://localhost:8080/rest/api/1/producto", {
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

            {/* Product Section */}
            <section className="flex justify-center items-center flex-wrap gap-y-2 gap-x-2 mt-4">
                <ProductCard name="Product 1" price={99.99} description="Product Description" />
                <ProductCard name="Product 2" price={199.99} description="Product Description" />
                <ProductCard name="Product 3" price={299.99} description="Product Description" />
                <ProductCard name="Product 4" price={399.99} description="Product Description" />
                <ProductCard name="Product 5" price={499.99} description="Product Description" />
                <ProductCard name="Product 6" price={599.99} description="Product Description" />
            </section>

            {/* Footer */}

        </div>
    );
};

export default LandingPage;
