import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Refuge from "./pages/Refuge";
import Benevole from "./pages/Benevole";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoutes";
import Archive from "./pages/Archive";
import Chatterie from "./pages/Chatterie";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import "./index.css";

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Refuge />
            </ProtectedRoute>
          }
        />
        <Route
          path="/refuge"
          element={
            <ProtectedRoute>
              <Refuge />
            </ProtectedRoute>
          }
        />
        <Route
          path="/benevole"
          element={
            <ProtectedRoute>
              <Benevole />
            </ProtectedRoute>
          }
        />
        <Route
          path="/stats"
          element={
            <ProtectedRoute>
              <Stats />
            </ProtectedRoute>
          }
        />
        <Route path="/login" element={<Login />} />
        <Route path="/logout" element={<Logout />} />
        <Route
          path="/archive"
          element={
            <ProtectedRoute>
              <Archive />
            </ProtectedRoute>
          }
        />
        <Route
          path="/chatterie"
          element={
            <ProtectedRoute>
              <Chatterie />
            </ProtectedRoute>
          }
        />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export { Logout };
