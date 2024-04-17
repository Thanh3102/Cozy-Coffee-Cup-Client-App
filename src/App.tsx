import React, { ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/page/Login";
import Home from "./components/page/Home";
import ProtectedRoute from "./components/feature/ProtectedRoute";
import Warehouse from "./components/page/Warehouse";
import Product from "./components/page/Product";

function App() {
  const routes: { path: string; element: ReactElement; protected: boolean }[] =
    [
      {
        path: "/",
        element: <Home />,
        protected: true,
      },
      {
        path: "/login",
        element: <Login />,
        protected: false,
      },
      {
        path: "/warehouse",
        element: <Warehouse />,
        protected: true,
      },
      {
        path: "product",
        element: <Product />,
        protected: true,
      },
    ];

  return (
    <div className="App">
      <ToastContainer autoClose={2000} hideProgressBar={true} />
      <Routes>
        {routes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.path}
              element={
                route.protected ? (
                  <ProtectedRoute>{route.element}</ProtectedRoute>
                ) : (
                  route.element
                )
              }
            />
          );
        })}
      </Routes>
    </div>
  );
}

export default App;
