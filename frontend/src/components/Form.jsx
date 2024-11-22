import { useState } from "react";
import PropTypes from "prop-types";
import api from "../api";
import { useNavigate } from "react-router-dom";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants";
import "../index.css";
import { PawPrint, Cat } from "lucide-react";

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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center p-4">
      <div className="absolute top-10 left-10 animate-bounce">
        <PawPrint
          size={32}
          className="text-amber-600 transform rotate-[-45deg]"
        />
      </div>
      <div className="absolute bottom-10 right-10 animate-bounce delay-100">
        <PawPrint
          size={32}
          className="text-amber-600 transform rotate-[45deg]"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6 relative overflow-hidden"
      >
        {/* Décoration d'arrière-plan */}
        <div className="absolute -right-6 -top-6 text-amber-100 transform rotate-12">
          <PawPrint size={64} />
        </div>

        <div className="flex items-center justify-center gap-3 mb-8">
          <Cat size={32} className="text-amber-600" />
          <h1 className="text-3xl font-bold text-center text-amber-600">
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
              className="peer w-full px-4 py-3 rounded-lg border border-amber-200 
                                    placeholder-transparent focus:outline-none focus:border-amber-500 
                                    focus:ring-2 focus:ring-amber-200 transition-all duration-300
                                    bg-amber-50"
              placeholder="Username"
            />
            <label
              htmlFor="username"
              className="absolute left-4 -top-6 text-sm text-amber-700
                                    peer-placeholder-shown:text-base peer-placeholder-shown:text-amber-400 
                                    peer-placeholder-shown:top-3 transition-all duration-300"
            >
              Nom d&apos;utilisateur
            </label>
            <PawPrint
              size={16}
              className="absolute right-4 top-4 text-amber-400"
            />
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 py-3 rounded-lg border border-amber-200 
                                    placeholder-transparent focus:outline-none focus:border-amber-500 
                                    focus:ring-2 focus:ring-amber-200 transition-all duration-300
                                    bg-amber-50"
              placeholder="Password"
            />
            <label
              htmlFor="password"
              className="absolute left-4 -top-6 text-sm text-amber-700
                                    peer-placeholder-shown:text-base peer-placeholder-shown:text-amber-400 
                                    peer-placeholder-shown:top-3 transition-all duration-300"
            >
              Mot de passe
            </label>
          </div>
        </div>

        <button
          type="submit"
          className="group w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold 
                             py-3 px-4 rounded-lg hover:from-amber-600 hover:to-orange-600 
                             focus:outline-none focus:ring-2 focus:ring-amber-500 
                             focus:ring-offset-2 transform transition-all duration-300 
                             hover:scale-[1.02] active:scale-[0.98] hover:shadow-lg
                             relative overflow-hidden"
          disabled={loading}
        >
          <span className="flex items-center justify-center gap-2">
            {loading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent" />
            ) : (
              <>
                <PawPrint
                  size={20}
                  className="transform group-hover:rotate-12 transition-transform duration-300"
                />
                {name}
              </>
            )}
          </span>
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
