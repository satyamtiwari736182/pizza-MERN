import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../CartContext";

const Navigation = () => {
  const { cart } = useContext(CartContext);
  const cartStyle = {
    background: "#f59e0d",
    display: "flex",
    padding: "6px 12px",
    borderRadius: "50px",
  };
  return (
    <React.Fragment>
      <nav className="container max-auto flex justify-between items-center py-4 ml-12">
        <Link to="/">
          <img style={{ height: 45 }} src="/images/logo.png" alt="logo" />
        </Link>
        <ul className="flex items-center">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li className="ml-6">
            <Link to="/products">Products</Link>
          </li>
          <li className="ml-6">
            <Link to="/cart">
              <div style={cartStyle}>
                <span className="text-white">
                  {cart.totalItems ? cart.totalItems : 0}
                </span>
                <img className="ml-2" src="/images/cart.png" alt="cart-icon" />
              </div>
            </Link>
          </li>
        </ul>
      </nav>
    </React.Fragment>
  );
};

export default Navigation;
