import { Button, Typography } from '@mui/joy';
import { ProductCard } from './ProductCard';
import { useEffect } from 'react';
import axios from 'axios';
import { getAccessToken } from '../store/auth';
import { Product } from '../store/store';
import { useState } from 'react';
import ImageCarousel from './ImageCarousel';
import { useNavigate } from 'react-router-dom';
import PromotionsCarousel from './PromotionCarousel/PromotionCarousel';

const LandingPage = () => {

    const [products, setProducts] = useState<Product[]>([])
    const [categories, setCategories] = useState<string[]>([])

    const navigate = useNavigate()

    async function loadCategories() {
        try {
            const response = await axios.get<string[]>(
                `http://localhost:8080/rest/api/1/producto/categorias`,
                {
                    headers: {
                        Authorization: `Bearer ${getAccessToken()}`,
                        "Content-Type": "application/json",
                        Accept: "application/json",
                    },
                }
            );
    
            if (response.status === 200) {
                setCategories(response.data);
            }
        } catch (error) {
            console.log("Error fetching categories", error);
        }
    }

    async function loadProducts() {

        
        console.log(`Bearer ${getAccessToken()}`)

        try{
            console.log({
                "Content-Type": "application/json",
                "Accept": "application/json",
                "Authorization": `Bearer ${getAccessToken()}`
            })
            let productRequest = await axios.get("http://localhost:8080/rest/api/1/producto/top", {
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
        Promise.all([loadProducts(), loadCategories()])
    }, [])

    return (
        <div className="bg-gray-100 min-h-screen flex flex-col">
            {/* Header */}
            <header className="bg-red-500 text-white p-6 text-center">
                <Typography level="h3" sx={{ color: "white" }}>Compara miles de productos y sus precios, y toma la mejor decision</Typography>
                <Typography level="body-lg" sx={{ color: "white" }}>Configura tu lista</Typography>
                <Button variant="solid" color="primary" className="mt-4" onClick={()=>{
                    navigate("/tienda")
                }}>Compara ahora</Button>
            </header>
            <br/>
            <div>
                <PromotionsCarousel />
            </div>
            <br />
            <div className='bg-white shadow-lg flex flex-col py-10 px-4'>
                <Typography level="h2" className="" sx={{mb: 2}}>Top Productos</Typography>
                <section className="grid grid-cols-5 justify-items-center items-center w-[90%] self-center">
                    {
                        products.slice(0,5).map((product: Product) => <ProductCard id={product.id} name={product.name} description={product.description} price={product.price} key={product.id} imageUrl={product.imageUrl}/>)
                    }
                </section>
            </div>
            
            <div className="py-10 px-5 my-10 bg-white">
                <Typography level='h1'>Categorias</Typography>

                <div className='grid grid-cols-3 text-center gap-4 mt-4'>
                    {categories.map((cat) => (
                    <div
                    key={cat}
                    onClick={()=>{
                        navigate("/tienda?category="+cat)
                    }}
                    className="relative overflow-hidden px-2 py-10 font-bold text-white rounded-md bg-gradient-to-r from-red-600 to-red-500 transition-all duration-[2000ms] ease-in-out hover:from-red-500 hover:to-red-600 hover:cursor-pointer"
                    >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    <div className="absolute inset-0 bg-white opacity-10 blur-sm pointer-events-none transition-all duration-[2000ms] hover:translate-x-full" />
                    </div>
                ))}
                </div>
            </div>

            <div className='flex flex-col my-10 gap-10 bg-white h-auto py-10'>
                <section>
                    <ImageCarousel />
                </section>
            </div>

            {/* Footer */}  

        </div>
    );
};

export default LandingPage;
