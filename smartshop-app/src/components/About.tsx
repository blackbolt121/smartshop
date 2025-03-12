import React from "react";

const About = () => {
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-2xl mt-5">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Acerca de Nuestra Aplicación</h2>
      <p className="text-gray-600">
        Nuestra aplicación te ayuda a comparar diferentes productos de manera rápida y sencilla. 
        Encuentra información detallada, compara precios, características y opiniones para tomar la mejor decisión de compra.
      </p>
      <p className="text-gray-600 mt-4">
        Con una interfaz intuitiva y fácil de usar, podrás ahorrar tiempo y dinero al elegir el producto que mejor se adapte a tus necesidades.
      </p>
      <p className="text-gray-600 mt-4 font-semibold">¡Haz compras inteligentes con nosotros!</p>
    </div>
  );
};

export default About;
