import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import {
  // Gestion des icones
  FaPaw,
  FaUserFriends,
  FaPlus,
  FaUserCircle,
  FaSignOutAlt,
  FaChartBar,
  FaArchive,
  FaBars,
} from "react-icons/fa";
import { RiHome5Fill } from "react-icons/ri";
import { ACCESS_TOKEN } from "../constants";
import FormCreateAnimal from "../components/FormCreateAnimal";
import FormCreateFA from "../components/FormCreateFA";

const Navbar = () => {
  const location = useLocation();
  const [activeItem, setActiveItem] = useState(() => {
    // Onglet active en violet
    const path = window.location.pathname.substring(1);
    return path || "refuge";
  });
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [currentUser, setCurrentUser] = useState({});
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [showFAForm, setShowFAForm] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem(ACCESS_TOKEN);

    const fetchCurrentUser = async () => {
      if (!accessToken) {
        navigate("/login");
        return;
      }

      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/current_user/`,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
          }
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setCurrentUser(data);
      } catch (error) {
        console.error(
          "Erreur lors de la récupération des informations de l'utilisateur:",
          error
        );
      }
    };

    fetchCurrentUser();
  }, [navigate]);

  useEffect(() => {
    // Ne mettre à jour que si le chemin change et n'est pas vide
    const path = location.pathname.substring(1);
    if (path) {
      setActiveItem(path);
    }
  }, [location.pathname]);

  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const toggleAnimalForm = () => {
    setShowAnimalForm((prevState) => !prevState);
  };

  const toggleFAForm = () => {
    setShowFAForm((prevState) => !prevState);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest(".popup-content") === null) {
      setShowAnimalForm(false);
      setShowFAForm(false);
    }
  };

  const preventClose = (event) => {
    event.stopPropagation();
  };

  // Calculer la position Y de l'indicateur -> permet bien placer bg violet
  const getIndicatorPosition = (item) => {
    switch (item) {
      case "refuge":
        return 0;
      case "chatterie":
        return 64;
      case "benevole":
        return 128;
      case "stats":
        return 207; // Modifié de 224 à 216
      case "archive":
        return 270; // Modifié de 288 à 280
      case "privacy-policy": // Ajout de ce cas
        return 0; // On peut mettre 0 ou null pour masquer l'indicateur
      default:
        return 0;
    }
  };

  return (
    <>
      {/* Bouton hamburger pour mobile */}
      <button
        onClick={toggleMobileMenu}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-purple-600 text-white"
      >
        <FaBars className="text-xl" />
      </button>

      {/* Overlay pour mobile */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      <nav
        className={`
        w-64 bg-white shadow-lg text-gray-600 p-6 fixed top-0 left-0 bottom-0 z-40
        transform transition-transform duration-300 ease-in-out
        ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0 md:block
      `}
      >
        <div className="flex items-center space-x-3 mb-8 hover:opacity-80 transition-opacity">
          <FaPaw className="text-3xl text-purple-600" />
          <span className="text-xl font-bold text-gray-800">Mistoufles</span>
        </div>

        <div className="mb-8 relative">
          <button
            onClick={toggleUserMenu}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100"
          >
            <FaUserCircle className="text-xl" />
            <span>{currentUser.username}</span>
          </button>
          {showUserMenu && (
            <div className="absolute top-full left-0 w-full bg-white shadow-lg rounded-lg mt-2 z-10">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 hover:bg-gray-100"
              >
                <FaSignOutAlt className="text-xl" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>

        <ul className="space-y-4 relative">
          {/* Indicateur de fond actif */}
          <div
            className={`absolute w-full h-[48px] bg-purple-100 rounded-lg transition-transform duration-200 ease-out ${
              activeItem === "privacy-policy" ? "hidden" : ""
            }`}
            style={{
              transform: `translateY(${getIndicatorPosition(activeItem)}px)`,
            }}
          />

          <li>
            <Link
              to="/refuge"
              className={`block w-full h-[48px] rounded-lg relative ${
                activeItem === "refuge" ? "text-purple-600" : "text-gray-600"
              }`}
              onClick={() => setActiveItem("refuge")}
            >
              <div className="flex items-center h-full px-4">
                <RiHome5Fill className="text-xl w-[20px]" />
                <span className="ml-3">Animaux en FA</span>
              </div>
            </Link>
          </li>

          {/* Après l'onglet FA (refuge) et avant bénévole */}
          <li>
            <Link
              to="/chatterie"
              className={`block w-full h-[48px] rounded-lg relative ${
                activeItem === "chatterie" ? "text-purple-600" : "text-gray-600"
              }`}
              onClick={() => setActiveItem("chatterie")}
            >
              <div className="flex items-center h-full px-4">
                <FaPaw className="text-xl w-[20px]" />
                <span className="ml-3">Chatterie</span>
              </div>
            </Link>
          </li>

          <li>
            <Link
              to="/benevole"
              className={`block w-full h-[48px] rounded-lg relative ${
                activeItem === "benevole" ? "text-purple-600" : "text-gray-600"
              }`}
              onClick={() => setActiveItem("benevole")}
            >
              <div className="flex items-center h-full px-4">
                <FaUserFriends className="text-xl w-[20px]" />
                <span className="ml-3">Bénévole</span>
              </div>
            </Link>
          </li>

          <div className="my-6 border-t border-gray-200"></div>

          <li>
            <Link
              to="/stats"
              className={`block w-full h-[48px] rounded-lg relative ${
                activeItem === "stats" ? "text-purple-600" : "text-gray-600"
              }`}
              onClick={() => setActiveItem("stats")}
            >
              <div className="flex items-center h-full px-4">
                <FaChartBar className="text-xl w-[20px]" />
                <span className="ml-3">Stats</span>
              </div>
            </Link>
          </li>

          <li>
            <Link
              to="/archive"
              className={`block w-full h-[48px] rounded-lg relative ${
                activeItem === "archive" ? "text-purple-600" : "text-gray-600"
              }`}
              onClick={() => setActiveItem("archive")}
            >
              <div className="flex items-center h-full px-4">
                <FaArchive className="text-xl w-[20px]" />
                <span className="ml-3">Archive</span>
              </div>
            </Link>
          </li>
        </ul>
        <div className="absolute bottom-6 left-6 right-6">
          <div className="space-y-3">
            <button
              onClick={toggleAnimalForm}
              className="w-full flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-3 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              <FaPlus className="text-sm" />
              <span>Ajouter un animal</span>
            </button>
            <button
              onClick={toggleFAForm}
              className="w-full flex items-center justify-center space-x-2 bg-white border-2 border-purple-600 text-purple-600 hover:bg-purple-50 px-4 py-3 rounded-lg transition-all duration-300"
            >
              <FaPlus className="text-sm" />
              <span>Ajouter FA</span>
            </button>
            <Link
              to="/privacy-policy"
              className="block text-center text-sm text-gray-500 hover:text-purple-600 transition-colors duration-300 mt-2"
            >
              Politique de confidentialité
            </Link>
          </div>
        </div>
      </nav>

      {/* Déplacé les modales ici, en dehors de la nav */}
      {showAnimalForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]"
          onClick={handleClickOutside}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-[1100px] h-[90vh] relative popup-content" // Augmenté max-w-2xl à max-w-[1800px]
            onClick={preventClose}
          >
            <button
              onClick={toggleAnimalForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition duration-300 text-2xl"
            >
              ✕
            </button>
            <div className="h-full overflow-y-auto pr-3">
              <div className="overflow-visible">
                <FormCreateAnimal onClose={toggleAnimalForm} />
              </div>
            </div>
          </div>
        </div>
      )}

      {showFAForm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[9999]"
          onClick={handleClickOutside}
        >
          <div
            className="bg-white rounded-lg shadow-xl p-6 w-full max-w-[700px] h-[90vh] relative popup-content" // Augmenté max-w-2xl à max-w-[1800px]
            onClick={preventClose}
          >
            <button
              onClick={toggleFAForm}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-900 transition duration-300 text-2xl"
            >
              ✕
            </button>
            <div className="h-full overflow-y-auto pr-3">
              <div className="overflow-visible">
                <FormCreateFA onClose={toggleFAForm} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Ajout d'un padding pour le contenu principal */}
      <div className="md:ml-56">
        {/* Le contenu principal de votre application ira ici */}
      </div>
    </>
  );
};

export default Navbar;
