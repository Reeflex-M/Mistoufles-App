import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { ACCESS_TOKEN } from "../constants";
import { FaCaretDown } from "react-icons/fa"; // Importer l'icône

function FormCreateAnimal({ onClose }) {
  const [name, setName] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [identificationNumber, setIdentificationNumber] = useState("");
  const [primoVacc, setPrimoVacc] = useState("");
  const [rappelVacc, setRappelVacc] = useState("");
  const [vermifuge, setVermifuge] = useState("");
  const [antipuce, setAntipuce] = useState("");
  const [sterilise, setSterilise] = useState(false);
  const [biberonnage, setBiberonnage] = useState(false);
  const [note, setNote] = useState("");
  const [statut, setStatut] = useState("");
  const [provenance, setProvenance] = useState("");
  const [categorie, setCategorie] = useState("");
  const [sexe, setSexe] = useState("");
  const [fa, setFa] = useState("");
  const [fas, setFas] = useState([]); // Nouveau état pour stocker tous les FA
  const [filteredFas, setFilteredFas] = useState([]); // Nouveau état pour les FA filtrés
  const [selectedFaId, setSelectedFaId] = useState(null); // Nouvel état pour l'ID du FA
  const [showFaList, setShowFaList] = useState(false); // Nouvel état pour contrôler la visibilité
  const faInputRef = useRef(null); // Référence pour le conteneur de l'input FA
  const [sexes, setSexes] = useState([]); // Nouvel état pour stocker les sexes
  const [provenances, setProvenances] = useState([]);
  const [statuts, setStatuts] = useState([]); // Ajout du state pour les statuts
  const [categories, setCategories] = useState([]); // Ajout du state pour les catégories

  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    const fetchFas = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/fa/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        console.log("Réponse reçue:", response);
        if (response.ok) {
          const data = await response.json();
          console.log("FA bien lu", data);
          setFas(data);
          setFilteredFas(data);
        } else {
          console.log("Réponse non OK:", response.status, response.statusText);
          throw new Error("Réponse non OK");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des FA:", error);
      }
    };

    fetchFas();
  }, []);

  useEffect(() => {
    const fetchSexes = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/animal/sexe/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          console.log("Données brutes des sexes:", data);
          // Vérifiez si data est un tableau ou un objet avec une propriété contenant le tableau
          const sexesArray = Array.isArray(data) ? data : Object.values(data);
          console.log("Tableau des sexes après traitement:", sexesArray);
          setSexes(sexesArray);
        } else {
          console.error("Erreur réponse API sexes:", response.status);
          throw new Error("Réponse non OK");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des sexes:", error);
        setSexes([]);
      }
    };

    const fetchProvenances = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/animal/provenance/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Données brutes des provenances:", data);
          const provenanceArray = Array.isArray(data)
            ? data
            : Object.values(data);
          console.log(
            "Tableau des provenances après traitement:",
            provenanceArray
          );
          setProvenances(provenanceArray); // Correction: utiliser setProvenances au lieu de setSexes
        } else {
          console.error("Erreur réponse API provenance:", response.status);
          throw new Error("Réponse non OK");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des provenance:", error);
        setProvenances([]);
      }
    };

    const fetchStatuts = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/animal/statut/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Données brutes des statuts:", data);
          const statutArray = Array.isArray(data) ? data : Object.values(data);
          console.log("Tableau des statuts après traitement:", statutArray);
          setStatuts(statutArray);
        } else {
          console.error("Erreur réponse API statut:", response.status);
          throw new Error("Réponse non OK");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statuts:", error);
        setStatuts([]);
      }
    };

    const fetchCategories = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/animal/categorie/",
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          console.log("Données brutes des catégories:", data);
          const categorieArray = Array.isArray(data)
            ? data
            : Object.values(data);
          console.log(
            "Tableau des catégories après traitement:",
            categorieArray
          );
          setCategories(categorieArray);
        } else {
          console.error("Erreur réponse API categorie:", response.status);
          throw new Error("Réponse non OK");
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des categories:", error);
        setCategories([]);
      }
    };

    fetchSexes();
    fetchProvenances(); // Appeler fetchProvenances
    fetchStatuts(); // Appel de la nouvelle fonction
    fetchCategories(); // Appel de la nouvelle fonction
  }, [accessToken]);

  // Ajouter useEffect pour gérer les clics en dehors
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (faInputRef.current && !faInputRef.current.contains(event.target)) {
        setShowFaList(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleFaChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setFa(e.target.value);
    setSelectedFaId(null); // Réinitialiser l'ID quand l'utilisateur tape
    setShowFaList(true); // Montrer la liste quand l'utilisateur tape
    if (searchTerm.length > 0) {
      setFilteredFas(
        fas.filter((fa) => {
          const prenomMatch =
            fa?.prenom_fa?.toLowerCase()?.includes(searchTerm) || false;
          return prenomMatch;
        })
      );
    } else {
      setFilteredFas([]);
    }
  };

  const toggleFaList = () => {
    setShowFaList(true);
    setFa("");
    setSelectedFaId(null);
    setFilteredFas(fas);
  };

  const handleFaClick = (f) => {
    setFa(f?.prenom_fa || "");
    setSelectedFaId(f?.id_fa); // Stocker l'ID du FA sélectionné
    setShowFaList(false);
    setFilteredFas([]);
  };

  // Ajouter cette fonction utilitaire pour formater les dates
  const formatDate = (dateString) => {
    if (!dateString) return null;
    // Vérifie si la date est valide
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return null;
    // Retourne la date au format YYYY-MM-DD
    return date.toISOString().split("T")[0];
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!name) {
      alert("Veuillez remplir le champ du nom.");
      return;
    }

    const animalData = {
      nom_animal: name,
      date_naissance: formatDate(birthDate),
      num_identification: identificationNumber || null,
      primo_vacc: formatDate(primoVacc),
      rappel_vacc: formatDate(rappelVacc),
      vermifuge: formatDate(vermifuge),
      antipuce: formatDate(antipuce),
      sterilise: sterilise ? 1 : 0,
      biberonnage: biberonnage ? 1 : 0,
      note: note || "",
      statut: statut ? parseInt(statut) : null,
      provenance: provenance ? parseInt(provenance) : null,
      categorie: categorie ? parseInt(categorie) : null,
      sexe: sexe ? parseInt(sexe) : null,
      fa: selectedFaId ? parseInt(selectedFaId) : null,
    };

    console.log("Données envoyées:", animalData); // Pour le débogage

    try {
      const response = await fetch("http://127.0.0.1:8000/api/animal/create/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(animalData),
      });

      const data = await response.json();
      console.log("Réponse de l'API:", data); // Pour le débogage

      if (!response.ok) {
        let errorMessage = "Erreur lors de la création de l'animal: ";
        if (typeof data === "object") {
          Object.entries(data).forEach(([key, value]) => {
            errorMessage += `${key}: ${value.join(", ")}; `;
          });
        }
        alert(errorMessage);
        return;
      }

      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Erreur:", error);
      alert("Une erreur est survenue lors de la communication avec le serveur");
    }
  };

  return (
    <div className="w-full">
      {" "}
      {/* Retirez toute classe overflow ou scroll */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Informations générales */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Informations générales
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="animalName"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Nom de l&apos;animal
              </label>
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
              <label
                htmlFor="identificationNumber"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Numéro d&apos;identification
              </label>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Dates importantes
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="birthDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date de naissance
              </label>
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
              <label
                htmlFor="primoVaccDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date du premier vaccin
              </label>
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
              <label
                htmlFor="rappelVaccDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date du rappel vaccinal
              </label>
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
              <label
                htmlFor="vermifugeDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date du vermifuge
              </label>
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
              <label
                htmlFor="antipuceDate"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Date de l&apos;anti-puce
              </label>
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
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Statut et caractéristiques
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* ... autres champs ... */}

            <div>
              <label
                htmlFor="faInput"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                FA
              </label>
              <div ref={faInputRef} className="relative">
                <div className="flex items-center">
                  <input
                    type="text"
                    id="faInput"
                    value={fa}
                    onChange={handleFaChange}
                    onFocus={() => setShowFaList(true)}
                    placeholder="Saisir le prénom du FA"
                    className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    autoComplete="off"
                  />
                  <FaCaretDown
                    className="ml-2 cursor-pointer"
                    onClick={toggleFaList}
                  />
                </div>
                {showFaList && filteredFas.length > 0 && (
                  <div className="absolute z-10 w-full bg-white border rounded-md shadow-lg mt-1 max-h-60 overflow-y-auto">
                    {filteredFas.map((f) => (
                      <div
                        key={`fa-suggestion-${f?.id_fa}`}
                        className="p-3 hover:bg-gray-100 cursor-pointer transition-colors duration-150"
                        onClick={() => handleFaClick(f)}
                      >
                        <div className="font-medium">
                          {f?.prenom_fa || "Sans prénom"}
                        </div>
                        <div className="text-sm text-gray-600">
                          {f?.commune_fa && <span>{f.commune_fa}</span>}
                          {f?.libelle_reseausociaux && (
                            <span className="ml-2">
                              • {f.libelle_reseausociaux}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            <div>
              <label
                htmlFor="sexe"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Sexe
              </label>
              <select
                id="sexe"
                value={sexe}
                onChange={(e) => {
                  console.log("Valeur sélectionnée:", e.target.value);
                  setSexe(e.target.value);
                }}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option key="default-select" value="">
                  Sélectionner le sexe
                </option>
                {sexes && sexes.length > 0 ? (
                  sexes.map((s) => (
                    <option
                      key={`sexe-${s.id_sexe || s.id}`}
                      value={s.id_sexe || s.id}
                    >
                      {s.libelle_sexe || s.libelle || "Sans libellé"}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Chargement des sexes...
                  </option>
                )}
              </select>
            </div>
            <div>
              <label
                htmlFor="provenance"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Provenance
              </label>
              <select
                id="provenance"
                value={provenance}
                onChange={(e) => setProvenance(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner la provenance</option>
                {provenances && provenances.length > 0 ? (
                  provenances.map((p) => (
                    <option
                      key={`provenance-${p.id_provenance || p.id}`}
                      value={p.id_provenance || p.id}
                    >
                      {p.libelle_provenance || p.libelle || "Sans libellé"}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Chargement des provenances...
                  </option>
                )}
              </select>
            </div>
            <div>
              <label
                htmlFor="statut"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Statut
              </label>
              <select
                id="statut"
                value={statut}
                onChange={(e) => setStatut(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner le statut</option>
                {statuts && statuts.length > 0 ? (
                  statuts.map((s) => (
                    <option
                      key={`statut-${s.id_statut || s.id}`}
                      value={s.id_statut || s.id}
                    >
                      {s.libelle_statut || s.libelle || "Sans libellé"}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Chargement des statuts...
                  </option>
                )}
              </select>
            </div>
            <div>
              <label
                htmlFor="categorie"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Catégorie
              </label>
              <select
                id="categorie"
                value={categorie}
                onChange={(e) => setCategorie(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Sélectionner la catégorie</option>
                {categories && categories.length > 0 ? (
                  categories.map((c) => (
                    <option
                      key={`categorie-${c.id_categorie || c.id}`}
                      value={c.id_categorie || c.id}
                    >
                      {c.libelle_categorie || c.libelle || "Sans libellé"}
                    </option>
                  ))
                ) : (
                  <option value="" disabled>
                    Chargement des catégories...
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* Caractéristiques supplémentaires */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Caractéristiques supplémentaires
          </h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="steriliseCheckbox"
                checked={sterilise}
                onChange={(e) => setSterilise(e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor="steriliseCheckbox"
                className="text-sm font-medium text-gray-700"
              >
                Stérilisé ?
              </label>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="biberonnageCheckbox"
                checked={biberonnage}
                onChange={(e) => setBiberonnage(e.target.checked)}
                className="mr-2"
              />
              <label
                htmlFor="biberonnageCheckbox"
                className="text-sm font-medium text-gray-700"
              >
                Biberonnage ?
              </label>
            </div>
          </div>
        </div>

        {/* Notes */}
        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 mb-4">
          <label
            htmlFor="noteTextarea"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Notes
          </label>
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
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded w-full mt-4"
        >
          Ajouter animal
        </button>
      </form>
    </div>
  );
}
FormCreateAnimal.propTypes = {
  onClose: PropTypes.func.isRequired,
};

export default FormCreateAnimal;
