
import {useNavigate} from "react-router-dom";

interface CategoryCardProps {
    name: string;
    icon: string;
}

interface CategorySectionProps {
    categories: string[];
    title: string;
}
// --- 4. Componente CategoriesSection (ACTUALIZADO) ---
const CategoryCard = ({ name, icon }: CategoryCardProps) => {

    const navigate = useNavigate()

    return <a href="#"
              className="group bg-white rounded-xl shadow-md p-4 flex flex-col items-center justify-center text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              onClick={()=>navigate("/tienda?category="+name)}
    >
        <div className="text-4xl mb-3 text-red-600 group-hover:text-red-700 transition-colors">
            {icon}
        </div>
        <h3 className="font-semibold text-gray-700 group-hover:text-gray-900 text-sm">
            {name}
        </h3>
    </a>
}


const CategoriesSection = ({ title = "Explora Nuestras Categorías", categories = [] }: CategorySectionProps) => {
    // El mapping se mantiene como una referencia interna
    const categoryMapping: { [key: string]: string; } = {
        'Herramientas manuales': '🛠️',
        'Productos ferreteros': '🔩',
        'Herramientas de poder': '⚡',
        'Accesorios para puertas': '🚪',
        'Cerradura y accesorio herrería': '🗝️',
        'Candados': '🔒',
        'Cerraduras para puertas': '🔑',
        'Cerradura y accesorio muebles': '🪑',
        'Iluminación y eléctricos': '💡',
        'Consumibles': '🧪',
        'Mercadeo': '📈',
        'Diagnóstico, medición y trazo': '📏',
        'Organización y almacenamiento': '📦',
        'Equipo de seguridad': '🦺',
        'Manejo grasa,aceite y fluidos': '🛢️',
        'Equipo hidráulico y carga': '🏗️',
    };

    return (
        <div className="bg-white py-12 sm:py-16">
            <div className="container mx-auto px-4">
                <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl lg:text-6xl tracking-tight text-center mb-2">{title}</h1>
                <div className="w-50 h-1 bg-red-600 mx-auto mb-15"></div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-8 gap-4">
                    {/* Iteramos sobre el array de strings recibido en las props */}
                    {categories.map((category: string) => (
                        // Corregimos la sintaxis para pasar el ícono como un string
                        <CategoryCard key={category} name={category.charAt(0).toUpperCase() + category.slice(1)} icon={String(categoryMapping[category])} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CategoriesSection