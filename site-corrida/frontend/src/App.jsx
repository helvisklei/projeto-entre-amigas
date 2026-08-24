import { BrowserRouter, Route, Routes } from "react-router-dom";

import Admin from "./pages/Admin";
import AdminSettings from "./pages/AdminSettings";
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import RetiradaKit from "./pages/RetiradaKit";
import TesteTermoRetirada from "./pages/TesteTermoRetirada";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/teste-termo-retirada" element={<TesteTermoRetirada />} />
        <Route path="/retirada-kit" element={<RetiradaKit />} />
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <AdminSettings />
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
