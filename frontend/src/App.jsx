import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Login";
import Refuge from "./pages/Refuge";
import Benevole from "./pages/Benevole";
import Stats from "./pages/Stats";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoutes";
import Archive from "./pages/Archive";
import Chatterie from "./pages/Chatterie";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import Layout from "./components/Layout";
import "./index.css";

const Logout = () => {
  localStorage.clear();
  return <Navigate to="/login" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route
            path="refuge"
            element={
              <ProtectedRoute>
                <Refuge />
              </ProtectedRoute>
            }
          />
          <Route
            path="benevole"
            element={
              <ProtectedRoute>
                <Benevole />
              </ProtectedRoute>
            }
          />
          <Route
            path="stats"
            element={
              <ProtectedRoute>
                <Stats />
              </ProtectedRoute>
            }
          />
          <Route
            path="archive"
            element={
              <ProtectedRoute>
                <Archive />
              </ProtectedRoute>
            }
          />
          <Route
            path="chatterie"
            element={
              <ProtectedRoute>
                <Chatterie />
              </ProtectedRoute>
            }
          />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="privacy-policy" element={<PrivacyPolicy />} />
          <Route path="*" element={<NotFound />} />
        </Route>
        <Route path="login" element={<Login />} />
        <Route path="logout" element={<Logout />} />
      </Routes>
    </Router>
  );
}

export default App;
export { Logout };
