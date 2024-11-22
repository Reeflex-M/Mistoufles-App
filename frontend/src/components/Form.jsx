import { useState } from "react";
import PropTypes from "prop-types";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../index.css";
import { Cat } from "lucide-react";

function Form({ route, method }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const name = method === "login" ? "Login" : "Register";

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();

    try {
      const res = await api.post(route, { username, password });
      if (method === "login") {
        localStorage.setItem(ACCESS_TOKEN, res.data.access);
        localStorage.setItem(REFRESH_TOKEN, res.data.refresh);
        navigate("/refuge");
      } else {
        navigate("/login");
      }
    } catch {
      alert("Les informations sont incorrectes 🙂");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-violet-50 flex items-center justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-lg shadow-md p-8 space-y-8"
      >
        <div className="flex items-center justify-center gap-3 mb-8">
          <Cat size={28} className="text-violet-600" />
          <h1 className="text-2xl font-medium text-center text-violet-900">
            Connexion Mistoufles
          </h1>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-violet-200 
                        focus:outline-none focus:border-violet-500 
                        focus:ring-1 focus:ring-violet-200
                        bg-white"
              placeholder="Nom d'utilisateur"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 rounded-md border border-violet-200 
                        focus:outline-none focus:border-violet-500 
                        focus:ring-1 focus:ring-violet-200
                        bg-white"
              placeholder="Mot de passe"
            />
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-violet-600 text-white font-medium 
                    py-2 px-4 rounded-md hover:bg-violet-700 
                    focus:outline-none focus:ring-2 focus:ring-violet-500 
                    focus:ring-offset-2 transition-colors duration-200"
          disabled={loading}
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mx-auto" />
          ) : (
            name
          )}
        </button>
      </form>
    </div>
  );
}

Form.propTypes = {
  route: PropTypes.string.isRequired,
  method: PropTypes.oneOf(["login", "register"]).isRequired,
};

export default Form;
