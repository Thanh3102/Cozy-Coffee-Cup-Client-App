import React, { Fragment, ReactElement } from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ArcElement,
} from "chart.js";
import Login from "./components/page/Login";
import Home from "./components/page/Home";
import ProtectedRoute from "./components/feature/ProtectedRoute";
import Warehouse from "./components/page/Warehouse";
import Product from "./components/page/Product";
import Definition from "./components/page/Definition";
import Order from "./components/page/Order";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Filler,
  Title,
  Tooltip,
  Legend
);

type RouteType = { path: string; element: ReactElement; protected: boolean };

function App() {
  const routes: RouteType[] = [
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
      path: "/product",
      element: <Product />,
      protected: true,
    },
    {
      path: "/definition",
      element: <Definition />,
      protected: true,
    },
    {
      path: "/order",
      element: <Order />,
      protected: true,
    },
    // {
    //   path: "/service",
    //   element: <Service />,
    //   protected: true,
    // },
  ];

  return (
    <div className="App">
      <ToastContainer autoClose={2000} hideProgressBar={true} limit={1} />
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
