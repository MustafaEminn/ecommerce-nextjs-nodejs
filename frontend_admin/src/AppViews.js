import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./views/login";
import Product from "./views/Product";

export const AppViews = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Login />
      </Route>
      <Route path="/urunler">
        <Product />
      </Route>
    </Switch>
  );
};

export default AppViews;
