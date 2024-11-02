import React, { useState } from 'react';
import { ACCESS_TOKEN } from '../constants';

function FormCreateFA({ onClose }) {
  const [prenom_fa, setPrenomFa] = useState('');
  const [commune_fa, setCommuneFa] = useState('');
  const [libelle_reseausociaux, setLibelle_reseausociaux] = useState('');
  const [telephone_fa, setTelephone_fa] = useState('');
  const [libelle_veterinaire, setLibelle_veterinaire] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
      setError('Vous devez être connecté pour créer une FA');
      return;
    }

    if (!prenom_fa.trim()) {
      setError("Le champ 'Prénom' est requis");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/fa/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          prenom_fa,
          commune_fa,
          libelle_reseausociaux,
          telephone_fa,
          libelle_veterinaire,
          note
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la création du FA');
      }

      console.log('FA créé avec succès');
      alert('FA créé avec succès!');
      onClose();
    } catch (error) {
      console.error('Erreur:', error);
      setError('Une erreur est survenue lors de la création de la FA');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="card bg-white rounded-lg shadow-md">
        <div className="card-body">
          <h2 className="text-2xl font-bold text-center mb-4">Créer une FA</h2>
          
          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="prenom_fa" className="block text-sm font-medium text-gray-700 mb-1">Prénom FA*</label>
              <input
                type="text"
                id="prenom_fa"
                value={prenom_fa}
                onChange={(e) => setPrenomFa(e.target.value)}
                placeholder="Entrez le prénom"
                required
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="commune_fa" className="block text-sm font-medium text-gray-700 mb-1">Commune FA</label>
              <input
                type="text"
                id="commune_fa"
                value={commune_fa}
                onChange={(e) => setCommuneFa(e.target.value)}
                placeholder="Entrez la commune"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="libelle_reseausociaux" className="block text-sm font-medium text-gray-700 mb-1">Libellé des réseaux sociaux</label>
              <input
                type="text"
                id="libelle_reseausociaux"
                value={libelle_reseausociaux}
                onChange={(e) => setLibelle_reseausociaux(e.target.value)}
                placeholder="Entrez le libellé des réseaux sociaux"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="telephone_fa" className="block text-sm font-medium text-gray-700 mb-1">Téléphone FA</label>
              <input
                type="tel"
                id="telephone_fa"
                value={telephone_fa}
                onChange={(e) => setTelephone_fa(e.target.value)}
                placeholder="Entrez le numéro de téléphone"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="libelle_veterinaire" className="block text-sm font-medium text-gray-700 mb-1">Libellé du vétérinaire</label>
              <input
                type="text"
                id="libelle_veterinaire"
                value={libelle_veterinaire}
                onChange={(e) => setLibelle_veterinaire(e.target.value)}
                placeholder="Entrez le libellé du vétérinaire"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-1">Note</label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Entrez une note si nécessaire"
                rows="3"
                className="w-full p-2 border rounded-md resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <button 
              type="submit" 
              className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mt-4 transition duration-300 ease-in-out transform hover:-translate-y-0.5"
            >
              Créer FA
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default FormCreateFA;