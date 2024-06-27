import { ReactElement } from "react";
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
import Account from "./components/page/Account";
import { Permission } from "./utils/types/enum";
import PermissionRequire from "./components/feature/PermissionRequire";

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

type RouteType = {
  path: string;
  element: ReactElement;
  authenticationRequired: boolean;
};

function App() {
  const routes: RouteType[] = [
    {
      path: "/",
      element: <Home />,
      authenticationRequired: true,
    },
    {
      path: "/login",
      element: <Login />,
      authenticationRequired: false,
    },
    {
      path: "/warehouse",
      element: (
        <PermissionRequire require={Permission.Warehouse_View}>
          <Warehouse />
        </PermissionRequire>
      ),
      authenticationRequired: true,
    },
    {
      path: "/product",
      element: (
        <PermissionRequire require={Permission.Product_View}>
          <Product />
        </PermissionRequire>
      ),
      authenticationRequired: true,
    },
    {
      path: "/definition",
      element: (
        <PermissionRequire require={Permission.Definition_View}>
          <Definition />
        </PermissionRequire>
      ),
      authenticationRequired: true,
    },
    {
      path: "/order",
      element: (
        <PermissionRequire require={Permission.Order_View}>
          <Order />
        </PermissionRequire>
      ),
      authenticationRequired: true,
    },
    {
      path: "/account",
      element: (
        <PermissionRequire require={Permission.Account_View}>
          <Account />
        </PermissionRequire>
      ),
      authenticationRequired: true,
    },
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
                route.authenticationRequired ? (
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
