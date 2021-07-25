import React from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import "./App.css";
import Navigation from "./components/Navigation";
// import About from "./pages/About";
import Cart from "./pages/Cart";
import Home from "./pages/Home";
import Products from "./pages/Products";
import SingleProduct from "./pages/SingleProduct";
import { CartContext } from "./CartContext";
import { useEffect, useState } from "react";
import { getCart, storeCart } from "./helpers";

const App = () => {
  const [cart, setCart] = useState({});
  // Fetch cart from local storage
  useEffect(() => {
    const cart = getCart().then((cart) => {
      setCart(JSON.stringify(cart));
    });
  }, []);
  useEffect(() => {
    storeCart(JSON.stringify(cart));
  }, [cart]);
  return (
    <React.Fragment>
      <BrowserRouter>
        <CartContext.Provider value={{ cart, setCart }}>
          <Navigation />
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>

            <Route path="/cart" component={Cart}></Route>
            <Route
              exact
              path="/products/:_id"
              component={SingleProduct}
            ></Route>
            <Route path="/products" component={Products}></Route>
            {/*<Route path="/about" component={About}></Route>*/}
          </Switch>
        </CartContext.Provider>
      </BrowserRouter>
    </React.Fragment>
  );
};

export default App;
