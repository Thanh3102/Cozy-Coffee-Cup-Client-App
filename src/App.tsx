import React from "react";
import { Route, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./components/page/Login";
import Home from "./components/page/Home";
import ProtectedRoute from "./components/feature/ProtectedRoute";
function App() {
  return (
    <div className="App">
      <ToastContainer autoClose={2000} hideProgressBar={true} />
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
