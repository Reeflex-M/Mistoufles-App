import React, { useState } from 'react';
import FormCreateAnimal from '../components/FormCreateAnimal';
import FormCreateFA from '../components/FormCreateFA';
import { FaPaw, FaCat, FaUserFriends, FaPlus, FaUserCircle, FaCog, FaSignOutAlt } from 'react-icons/fa';
import { RiHome5Fill } from 'react-icons/ri';
import { ACCESS_TOKEN, REFRESH_TOKEN } from '../constants';
import { User } from 'django.contrib.auth.models';


function Home() {
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [showFAForm, setShowFAForm] = useState(false);
  const [activeItem, setActiveItem] = useState('refuge');
  const [showUserMenu, setShowUserMenu] = useState(false);

  const currentUser = {
    name: `${User.Username}`,
  };


  const toggleUserMenu = () => {
    setShowUserMenu(!showUserMenu);
  };

  const handleLogout = () => {
    console.log("Déconnexion...");
  };

  const toggleAnimalForm = () => {
    setShowAnimalForm(prevState => !prevState);
  };

  const toggleFAForm = () => {
    setShowFAForm(prevState => !prevState);
  };

  const handleClickOutside = (event) => {
    if (event.target.closest('.popup-content') === null) {
      setShowAnimalForm(false);
      setShowFAForm(false);
    }
  };

  const preventClose = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <nav className="w-64 bg-white shadow-lg text-gray-600 p-6 fixed top-0 left-0 bottom-0 md:block hidden border-r border-gray-200">
        <div className="flex items-center space-x-3 mb-8">
          <FaPaw className="text-3xl text-purple-600" />
          <span className="text-xl font-bold text-gray-800">Mistoufles</span>
        </div>

        <div className="mb-8 relative">
          <button
            onClick={toggleUserMenu}
            className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 transition-all duration-300"
          >
            <FaUserCircle className="text-2xl text-purple-600" />
            <div className="flex-1 text-left">
              <div className="font-medium text-gray-800">{currentUser.name}</div>

            </div>
          </button>

          {showUserMenu && (
            <div className="absolute w-full mt-2 py-2 bg-white rounded-lg shadow-xl border border-gray-100">
              <button
                className="w-full flex items-center space-x-3 px-4 py-2 text-gray-600 hover:bg-purple-50 hover:text-purple-600"
                onClick={() => console.log("Paramètres")}
              >
                <FaCog className="text-lg" />
                <span>Paramètres</span>
              </button>
              <button
                className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 hover:bg-red-50"
                onClick={handleLogout}
              >
                <FaSignOutAlt className="text-lg" />
                <span>Déconnexion</span>
              </button>
            </div>
          )}
        </div>
        
        <ul className="space-y-4">
          <li>
            <button
              onClick={() => setActiveItem('refuge')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeItem === 'refuge'
                ? 'bg-purple-100 text-purple-600 shadow-sm'
                : 'hover:bg-gray-100'
              }`}
            >
              <RiHome5Fill className="text-xl" />
              <span>Refuge</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveItem('chatterie')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeItem === 'chatterie'
                ? 'bg-purple-100 text-purple-600 shadow-sm'
                : 'hover:bg-gray-100'
              }`}
            >
              <FaCat className="text-xl" />
              <span>Chatterie</span>
            </button>
          </li>
          <li>
            <button
              onClick={() => setActiveItem('benevole')}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                activeItem === 'benevole'
                ? 'bg-purple-100 text-purple-600 shadow-sm'
                : 'hover:bg-gray-100'
              }`}
            >
              <FaUserFriends className="text-xl" />
              <span>Bénévole</span>
            </button>
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
          </div>
        </div>
      </nav>

      <div className="flex-grow flex flex-col md:pl-64">
        <main className="flex-grow p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Bienvenue sur Mistoufles App</h1>
            <p className="text-gray-600 mt-2">Gérez votre refuge en toute simplicité</p>
          </div>

          {showAnimalForm && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleClickOutside}>
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative z-50 popup-content" onClick={preventClose}>
                <button 
                  onClick={toggleAnimalForm} 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 transition duration-300"
                >
                  &times;
                </button>
                <div className="max-h-[90vh] overflow-y-auto">
                  <FormCreateAnimal onClose={toggleAnimalForm} />
                </div>
              </div>
            </div>
          )}

          {showFAForm && (
            <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={handleClickOutside}>
              <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl relative z-50 popup-content" onClick={preventClose}>
                <button 
                  onClick={toggleFAForm} 
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-900 transition duration-300"
                >
                  &times;
                </button>
                <div className="max-h-[90vh] overflow-y-auto">
                  <FormCreateFA onClose={toggleFAForm} />
                </div>
              </div>
            </div>
          )}
        </main>

        <footer className="text-center py-4 text-gray-600 border-t border-gray-200">
          &copy; 2023 Mistoufles App
        </footer>
      </div>
    </div>
  );
}

export default Home;