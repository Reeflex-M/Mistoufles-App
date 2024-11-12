import { useState } from "react";
import PropTypes from "prop-types";
import { ACCESS_TOKEN } from "../constants";

function FormCreateFA({ onClose }) {
  const [prenom_fa, setPrenomFa] = useState("");
  const [commune_fa, setCommuneFa] = useState("");
  const [libelle_reseausociaux, setLibelle_reseausociaux] = useState("");
  const [telephone_fa, setTelephone_fa] = useState("");
  const [libelle_veterinaire, setLibelle_veterinaire] = useState("");
  const [note, setNote] = useState("");
  const [error, setError] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const accessToken = localStorage.getItem(ACCESS_TOKEN);
    if (!accessToken) {
      setError("Vous devez être connecté pour créer une FA");
      return;
    }

    if (!prenom_fa.trim()) {
      setError("Le champ 'Prénom' est requis");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:8000/api/fa/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          prenom_fa,
          commune_fa,
          libelle_reseausociaux,
          telephone_fa,
          libelle_veterinaire,
          note,
        }),
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la création du FA");
      }

      console.log("FA créé avec succès");
      alert("FA créé avec succès!");
      onClose();
    } catch (error) {
      console.error("Erreur:", error);
      setError("Une erreur est survenue lors de la création de la FA");
    }
  };

  return (
    <div className="max-w-md mx-auto h-full">
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg flex flex-col h-full">
        <div className="p-4">
          <h2 className="text-xl font-bold mb-4 text-purple-800 text-center border-b-2 border-purple-200 pb-2">
            Nouvelle Famille d'Accueil
          </h2>

          {error && <p className="text-red-400 text-sm mb-3 bg-red-50 p-2 rounded">{error}</p>}

          <div className="space-y-3">
            <div>
              <label htmlFor="prenom_fa" className="text-sm text-gray-600 block mb-1">
                Prénom*
              </label>
              <input
                type="text"
                id="prenom_fa"
                value={prenom_fa}
                onChange={(e) => setPrenomFa(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md transition-all duration-200 ease-in-out focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                placeholder="Prénom de la FA"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="commune_fa" className="text-sm text-gray-600 block mb-1">
                  Commune
                </label>
                <input
                  type="text"
                  id="commune_fa"
                  value={commune_fa}
                  onChange={(e) => setCommuneFa(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md transition-all duration-200 ease-in-out focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                  placeholder="Ville"
                />
              </div>

              <div>
                <label htmlFor="telephone_fa" className="text-sm text-gray-600 block mb-1">
                  Téléphone
                </label>
                <input
                  type="tel"
                  id="telephone_fa"
                  value={telephone_fa}
                  onChange={(e) => setTelephone_fa(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-md transition-all duration-200 ease-in-out focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                  placeholder="0X XX XX XX XX"
                />
              </div>
            </div>

            <div>
              <label htmlFor="libelle_reseausociaux" className="text-sm text-gray-600 block mb-1">
                Réseaux sociaux
              </label>
              <input
                type="text"
                id="libelle_reseausociaux"
                value={libelle_reseausociaux}
                onChange={(e) => setLibelle_reseausociaux(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md transition-all duration-200 ease-in-out focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                placeholder="@pseudo"
              />
            </div>

            <div>
              <label htmlFor="libelle_veterinaire" className="text-sm text-gray-600 block mb-1">
                Vétérinaire
              </label>
              <input
                type="text"
                id="libelle_veterinaire"
                value={libelle_veterinaire}
                onChange={(e) => setLibelle_veterinaire(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md transition-all duration-200 ease-in-out focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none"
                placeholder="Nom du vétérinaire"
              />
            </div>

            <div>
              <label htmlFor="note" className="text-sm text-gray-600 block mb-1">
                Notes
              </label>
              <textarea
                id="note"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-md transition-all duration-200 ease-in-out focus:border-blue-400 focus:ring-1 focus:ring-blue-400 focus:outline-none resize-none"
                rows="3"
                placeholder="Informations complémentaires..."
              />
            </div>
          </div>
        </div>

        <div className="mt-auto p-4 bg-gray-50 rounded-b-lg border-t">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border-2 border-purple-300 text-purple-700 rounded-md hover:bg-purple-50 hover:border-purple-400 transition-all duration-300 font-medium"
            >
              Annuler
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-all duration-300 shadow-md hover:shadow-lg font-medium"
            >
              Créer
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

FormCreateFA.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default FormCreateFA;
