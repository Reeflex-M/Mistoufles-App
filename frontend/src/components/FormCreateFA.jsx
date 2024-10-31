// src/components/FormCreateFA.jsx
import React, { useState } from 'react';
import { ACCESS_TOKEN } from '../constants'; // Importez votre constante

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

    // Vérification de l'authentification
    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
      setError('Vous devez être connecté pour créer une FA');
      return;
    }

    // Vérification des champs obligatoires
    if (
      !prenom_fa
    ) {
      setError("Veuillez remplir le Prénom");
      return;
    }

    try {
      const response = await fetch('http://127.0.0.1:8000/api/fa/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}` // Utilisez le token stocké dans le localStorage
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
    <form onSubmit={handleSubmit} className="space-y-6 p-4">
      {error && <p className="text-red-500">{error}</p>}
      
      {/* Champs du formulaire */}
      <input
        type="text"
        value={prenom_fa}
        onChange={(e) => setPrenomFa(e.target.value)}
        placeholder="Prénom FA*"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={commune_fa}
        onChange={(e) => setCommuneFa(e.target.value)}
        placeholder="Commune FA"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={libelle_reseausociaux}
        onChange={(e) => setLibelle_reseausociaux(e.target.value)}
        placeholder="Libellé des réseaux sociaux"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="tel"
        value={telephone_fa}
        onChange={(e) => setTelephone_fa(e.target.value)}
        placeholder="Téléphone FA"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="text"
        value={libelle_veterinaire}
        onChange={(e) => setLibelle_veterinaire(e.target.value)}
        placeholder="Libellé du "
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Note"
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      
      <button 
        type="submit" 
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
      >
        Créer FA
      </button>
    </form>
  );
}

export default FormCreateFA;