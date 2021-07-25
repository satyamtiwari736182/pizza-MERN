import React, { useState, useEffect, useContext } from "react";
import Product from "../components/Product";
import { CartContext } from "../CartContext";
const Products = () => {
  const [products, setProducts] = useState([]);
  const { name } = useContext(CartContext);
  useEffect(() => {
    fetch("/api/products")
      .then((response) => response.json())
      .then((products) => {
        console.log(products);
        setProducts(products);
      });
  }, []);

  return (
    <div className="container mx-auto pb-24">
      <h1 className="text-lg font-bold my-8">Products {name}</h1>
      <div className="grid grid-cols-5 my-8 gap-24">
        {!products.length
          ? console.log("No element")
          : products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
      </div>
    </div>
  );
};

export default Products;
