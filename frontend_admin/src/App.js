import React from "react";
import "antd/dist/antd.css";
import "./App.css";
import { BrowserRouter as Router } from "react-router-dom";
import AppViews from "./AppViews";
function App({ children, ...rest }) {
  return (
    <div className="App">
      <Router>
        <AppViews />
      </Router>
    </div>
  );
}
export default App;
