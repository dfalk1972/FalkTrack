import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";
import Pending from "./pages/Pending/Pending";
import { AuthProvider } from "./context/AuthContext";

// ProtectedRoute is imported here for future phases (Jobs, Assets, Admin
// Panel) to wrap their routes with, e.g.:
//   <Route path="/jobs" element={<ProtectedRoute><Jobs /></ProtectedRoute>} />
// eslint-disable-next-line no-unused-vars
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/pending" element={<Pending />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
