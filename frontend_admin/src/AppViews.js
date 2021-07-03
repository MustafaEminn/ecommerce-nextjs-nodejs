import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./views/login";
import Product from "./views/Product";
import Members from "./views/members";
import Order from "./views/orders";
import { PAGE } from "./constants/page";

export const AppViews = () => {
  return (
    <Switch>
      <Route path={PAGE.home.href} exact>
        <Login />
      </Route>
      <Route path={PAGE.products.href}>
        <Product />
      </Route>
      <Route path={PAGE.members.href}>
        <Members />
      </Route>
      <Route path={PAGE.orders.href}>
        <Order />
      </Route>
    </Switch>
  );
};

export default AppViews;
