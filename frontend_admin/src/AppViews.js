import React from "react";
import { Route, Switch } from "react-router-dom";
import Login from "./views/login";
import Post from "./views/Post";

export const AppViews = () => {
  return (
    <Switch>
      <Route path="/" exact>
        <Login />
      </Route>
      <Route path="/haber">
        <Post />
      </Route>
    </Switch>
  );
};

export default AppViews;
