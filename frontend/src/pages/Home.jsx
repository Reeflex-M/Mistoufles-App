import React, { useState } from 'react';
import FormCreateAnimal from '../components/FormCreateAnimal';
import FormCreateFA from '../components/FormCreateFA'; // Assurez-vous d'avoir ce composant

function Home() {
  const [showAnimalForm, setShowAnimalForm] = useState(false);
  const [showFAForm, setShowFAForm] = useState(false);

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
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Welcome to Mistoufles App</h1>
        <div className="space-x-4">
          <button 
            onClick={toggleAnimalForm} 
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
          >
            Ajouter un animal
          </button>
          <button 
            onClick={toggleFAForm} 
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
          >
            Ajouter FA
          </button>
        </div>
        
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
    </div>
  );
}

export default Home;