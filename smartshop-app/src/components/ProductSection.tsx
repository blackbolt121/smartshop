

import ProductCard from "./ProductCard.tsx";
import SkeletonCard from "./SkeletonCard.tsx";
import {Product} from "../store/store.ts";
interface ProductSectionProps {
    productData: Product[];
    title: string;
}
const ProductsSection = ( {productData, title}: ProductSectionProps) => {



    const renderContent = () => {

        if (productData.length == 0) {
            return <div>
                {[0,1,2,3,4,5].map( x => {
                    console.log(x);
                    return (<SkeletonCard/>)
                })}
            </div>;
        }

        // Aquí se renderiza TU ProductCard con las props correctas.
        return productData.map((product) => (
            <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                description={product.description}
                imageUrl={product.imageUrl}
            />
        ));
    };

    return (
        <div className="">
            <div className='container mx-auto px-4'>
                <h2 className="text-3xl font-bold text-center text-gray-800 mb-10">{title}</h2>
                {/* La grilla responsiva se ajusta para mostrar las tarjetas.
                    El `justify-items-center` ayuda a centrar las tarjetas si el espacio de la grilla es mayor.
                */}
                <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-8 justify-items-center">
                    {renderContent()}
                </section>
            </div>
        </div>
    );
};


export default ProductsSection;