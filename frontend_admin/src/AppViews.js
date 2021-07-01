import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./views/login";
import Product from "./views/Product";
import Members from "./views/members";

export const AppViews = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Login />
      </Route>
      <Route path="/urunler">
        <Product />
      </Route>
      <Route path="/uyeler">
        <Members />
      </Route>
    </Switch>
  );
};

export default AppViews;
