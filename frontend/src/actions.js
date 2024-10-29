import React from 'react';

export const handleAddAnimal = async (event) => {
  event.preventDefault();
  
  const animalData = {
    nom_animal: document.getElementById('animalName').value,
    date_naissance: document.getElementById('birthDate').value,
    num_identification: document.getElementById('identificationNumber').value,
    primo_vacc: document.getElementById('primoVaccDate').value || null,
    rappel_vacc: document.getElementById('rappelVaccDate').value || null,
    vermifuge: document.getElementById('vermifugeDate').value || null,
    antipuce: document.getElementById('antipuceDate').value || null,
    sterilise: document.getElementById('steriliseCheckbox').checked ? 1 : 0,
    biberonnage: document.getElementById('biberonnageCheckbox').checked ? 1 : 0,
    note: document.getElementById('noteTextarea').value || '',
    statut: parseInt(document.getElementById('statutSelect').value),
    provenance: parseInt(document.getElementById('provenanceSelect').value),
    categorie: parseInt(document.getElementById('categorieSelect').value),
    sexe: parseInt(document.getElementById('sexeSelect').value),
    fa: parseInt(document.getElementById('faSelect').value)
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
    // Vous pouvez ajouter ici une action pour réinitialiser le formulaire ou afficher un message de succès
  } catch (error) {
    console.error('Erreur:', error);
    // Affichez un message d'erreur à l'utilisateur
  }
};

export default handleAddAnimal;