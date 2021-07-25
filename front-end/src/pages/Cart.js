import React, { useContext, useEffect, useState } from "react";
import { CartContext } from "../CartContext";

const Cart = () => {
  let totalPrice = 0;
  const [products, setProducts] = useState([]);
  const { cart, setCart } = useContext(CartContext);
  const [priceFetched, togglePriceFetched] = useState(false);
  console.log(cart);
  useEffect(() => {
    if (!cart.items || priceFetched) return;
    // console.log("Cart", Object.keys(cart));
    fetch("/api/products/cart-items", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ids: Object.keys(cart.items) }),
    })
      .then((res) => res.json())
      .then((products) => {
        setProducts(products);
        togglePriceFetched(true);
      });
  }, [cart, priceFetched]);

  const getQty = (productId) => cart.items[productId];
  const handlechange = (productId, op) => {
    const existingQty = cart.items[productId];
    if (op === -1 && existingQty === 1) return;
    const _cart = { ...cart };
    _cart.items[productId] = existingQty + op;
    _cart.totalItems += op;
    setCart(_cart);
  };
  const getSum = (productId, price) => {
    const sum = price * getQty(productId);
    totalPrice += sum;
    return sum;
  };

  const handleRemove = (productId) => {
    const _cart = { ...cart };
    const qty = _cart.items[productId];
    delete _cart.items[productId];
    _cart.totalItems -= qty;
    setCart(_cart);
    const updatedProductsList = products.filter(
      (product) => product._id !== productId
    );
    setProducts(updatedProductsList);
  };
  const handleOrderNow = () => {
    window.alert("Order placed successfully !");
    setProducts([]);
    setCart({});
  };
  return !products.length ? (
    <img
      className="mx-auto w-1/2 mt-12"
      src="/images/empty-cart.png"
      alt="Cart image empty"
    />
  ) : (
    <div className="container mx-auto lg:w-1/2 w-full pb-24">
      <h1 className="my-12 font-bold">Cart-Items</h1>
      <ul>
        <hr className="my-6" />
        {products.map((product) => {
          return (
            <li className="mb-12" key={product._id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <img className="h-16" src={product.image} alt="" />
                  <span className="font-bold ml-4 w-48">{product.name}</span>
                </div>
                <div>
                  {" "}
                  <button
                    onClick={() => {
                      handlechange(product._id, -1);
                    }}
                    className="bg-yellow-500 px-4 py-2 rounded-full leading-none"
                  >
                    -
                  </button>
                  <b className="px-4">{getQty(product._id)}</b>
                  <button
                    onClick={() => {
                      handlechange(product._id, 1);
                    }}
                    className="bg-yellow-500 px-4 py-2 rounded-full leading-none"
                  >
                    +
                  </button>
                </div>
                <span>₹ {getSum(product._id, product.price)}</span>
                <button
                  onClick={() => {
                    handleRemove(product._id);
                  }}
                  className="bg-red-500 px-4 py-2 rounded-full leading-none text-white"
                >
                  Remove
                </button>
              </div>
            </li>
          );
        })}
      </ul>
      <hr className="my-6" />
      <div className="text-right">
        ,<b>Grand Total:</b> ₹ {totalPrice}
      </div>
      <div className="text-right mt-4">
        <button
          onClick={handleOrderNow}
          className="bg-yellow-500 px-4 py-2 rounded-full leading-none"
        >
          Order Now
        </button>
      </div>
    </div>
  );
};

export default Cart;
