import React, { useState, useEffect } from 'react';
import { ACCESS_TOKEN } from '../constants';

function FormCreateAnimal({ onClose }) {
  const [name, setName] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [identificationNumber, setIdentificationNumber] = useState('');
  const [primoVacc, setPrimoVacc] = useState('');
  const [rappelVacc, setRappelVacc] = useState('');
  const [vermifuge, setVermifuge] = useState('');
  const [antipuce, setAntipuce] = useState('');
  const [sterilise, setSterilise] = useState(false);
  const [biberonnage, setBiberonnage] = useState(false);
  const [note, setNote] = useState('');
  const [statut, setStatut] = useState('');
  const [provenance, setProvenance] = useState('');
  const [categorie, setCategorie] = useState('');
  const [sexe, setSexe] = useState('');
  const [fa, setFa] = useState('');
  const [filteredFas, setFilteredFas] = useState([]);

  useEffect(() => {
    const searchFas = async () => {
      if (fa.length > 2) {
        try {
          const response = await fetch(`http://127.0.0.1:8000/api/fa/?q=${encodeURIComponent(fa)}`, {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${ACCESS_TOKEN}`
            }
          });
          if (response.ok) {
            const data = await response.json();
            setFilteredFas(data);
          }
        } catch (error) {
          console.error("Erreur lors de la recherche des FA:", error);
        }
      } else {
        setFilteredFas([]);
      }
    };
  
    searchFas();
  }, [fa]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const animalData = {
      nom_animal: name,
      date_naissance: birthDate,
      num_identification: identificationNumber,
      primo_vacc: primoVacc || null,
      rappel_vacc: rappelVacc || null,
      vermifuge: vermifuge || null,
      antipuce: antipuce || null,
      sterilise: sterilise ? 1 : 0,
      biberonnage: biberonnage ? 1 : 0,
      note: note || '',
      statut: parseInt(statut),
      provenance: parseInt(provenance),
      categorie: parseInt(categorie),
      sexe: parseInt(sexe),
      fa: fa.trim() // Utilisez la valeur trimée de fa
    };

    try {
      const response = await fetch('/api/animal/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer YOUR_ACCESS_TOKEN_HERE'
        },
        body: JSON.stringify(animalData)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création de l\'animal');
      }

      console.log('Animal créé avec succès');
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      // Affichez un message d'erreur à l'utilisateur
    }
  };

  return (
    <div className="max-h-[90vh] overflow-y-auto">
      <form onSubmit={handleSubmit} className="space-y-6 p-4">
        {/* Informations générales */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Informations générales</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="animalName" className="block text-sm font-medium text-gray-700 mb-1">Nom de l'animal</label>
              <input
                type="text"
                id="animalName"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Nom de l'animal"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="identificationNumber" className="block text-sm font-medium text-gray-700 mb-1">Numéro d'identification</label>
              <input
                type="text"
                id="identificationNumber"
                value={identificationNumber}
                onChange={(e) => setIdentificationNumber(e.target.value)}
                placeholder="Numéro d'identification"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Dates importantes */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Dates importantes</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="birthDate" className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
              <input
                type="date"
                id="birthDate"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                placeholder="Date de naissance"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="primoVaccDate" className="block text-sm font-medium text-gray-700 mb-1">Date du premier vaccin</label>
              <input
                type="date"
                id="primoVaccDate"
                value={primoVacc}
                onChange={(e) => setPrimoVacc(e.target.value)}
                placeholder="Date du premier vaccin"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="rappelVaccDate" className="block text-sm font-medium text-gray-700 mb-1">Date du rappel vaccinal</label>
              <input
                type="date"
                id="rappelVaccDate"
                value={rappelVacc}
                onChange={(e) => setRappelVacc(e.target.value)}
                placeholder="Date du rappel vaccinal"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="vermifugeDate" className="block text-sm font-medium text-gray-700 mb-1">Date du vermifuge</label>
              <input
                type="date"
                id="vermifugeDate"
                value={vermifuge}
                onChange={(e) => setVermifuge(e.target.value)}
                placeholder="Date du vermifuge"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label htmlFor="antipuceDate" className="block text-sm font-medium text-gray-700 mb-1">Date de l'anti-puce</label>
              <input
                type="date"
                id="antipuceDate"
                value={antipuce}
                onChange={(e) => setAntipuce(e.target.value)}
                placeholder="Date de l'anti-puce"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Statut et caractéristiques */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Statut et caractéristiques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ... autres champs ... */}
            <div>
              <label htmlFor="faInput" className="block text-sm font-medium text-gray-700 mb-1">FA</label>
              <input
                type="text"
                id="faInput"
                value={fa}
                onChange={(e) => setFa(e.target.value)}
                placeholder="Entrez le nom de la FA"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {filteredFas.length > 0 && (
                <ul className="mt-2 bg-gray-100 p-2 rounded-md">
                  {filteredFas.map((faItem) => (
                    <li key={faItem.id}>
                      <button 
                        onClick={() => {
                          setFa(faItem.name);
                          setFilteredFas([]);
                        }}
                        className="w-full text-left p-2 hover:bg-gray-200"
                      >
                        {faItem.name}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>

        {/* Caractéristiques supplémentaires */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Caractéristiques supplémentaires</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="steriliseCheckbox"
                checked={sterilise}
                onChange={(e) => setSterilise(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="steriliseCheckbox" className="text-sm font-medium text-gray-700">Stérilisé ?</label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="biberonnageCheckbox"
                checked={biberonnage}
                onChange={(e) => setBiberonnage(e.target.checked)}
                className="mr-2"
              />
              <label htmlFor="biberonnageCheckbox" className="text-sm font-medium text-gray-700">Biberonnage ?</label>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <label htmlFor="noteTextarea" className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
          <textarea
            id="noteTextarea"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Ajoutez des notes sur l'animal..."
            className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button 
          type="submit" 
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
        >
          Ajouter animal
        </button>
      </form>
    </div>
  );
}

export default FormCreateAnimal;