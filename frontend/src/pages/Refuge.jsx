import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { ACCESS_TOKEN } from "../constants";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import ImageIcon from "@mui/icons-material/Image";
import DeleteIcon from "@mui/icons-material/Delete";

// Popup Onclick fa_libelle
const FaDialog = ({ open, onClose, faData }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        style: {
          borderRadius: "8px",
        },
      }}
    >
      <DialogTitle className="bg-gray-50 border-b px-6 py-4">
        <div className="text-xl font-medium text-gray-900">
          Informations Famille d'Accueil
        </div>
      </DialogTitle>
      <DialogContent className="px-6 py-4">
        <div className="space-y-4">
          <div className="grid grid-cols-1 gap-6">
            {/* Informations personnelles */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                Coordonnées
              </h3>
              <div className="space-y-3 ml-1">
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">Prénom</span>
                  <span className="text-gray-900">
                    {faData?.prenom_fa || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">Commune</span>
                  <span className="text-gray-900">
                    {faData?.commune_fa || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Contact */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                Contact
              </h3>
              <div className="space-y-3 ml-1">
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">Téléphone</span>
                  <span className="text-gray-900">
                    {faData?.telephone_fa || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">Email</span>
                  <span className="text-gray-900">
                    {faData?.email_fa || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">Réseaux</span>
                  <span className="text-gray-900">
                    {faData?.libelle_reseausociaux || "N/A"}
                  </span>
                </div>
              </div>
            </div>

            {/* Suivi */}
            <div className="space-y-4">
              <h3 className="text-sm uppercase tracking-wider text-gray-500 font-medium">
                Suivi médical
              </h3>
              <div className="space-y-3 ml-1">
                <div className="flex items-center">
                  <span className="text-gray-600 w-32 text-sm">
                    Vétérinaire
                  </span>
                  <span className="text-gray-900">
                    {faData?.libelle_veterinaire || "N/A"}
                  </span>
                </div>
                <div className="flex items-start">
                  <span className="text-gray-600 w-32 text-sm pt-1">Note</span>
                  <span className="text-gray-900 flex-1 whitespace-pre-wrap">
                    {faData?.note || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
      <DialogActions className="px-6 py-4 border-t">
        <button
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-md transition-colors duration-150"
        >
          Fermer
        </button>
      </DialogActions>
    </Dialog>
  );
};

// Ajouter ce nouveau composant pour la popup d'images
const ImageDialog = ({ open, onClose, animalId, animalName }) => {
  const [images, setImages] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  const fetchImages = async () => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/animal/${animalId}/images/`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );
      if (response.ok) {
        const data = await response.json();
        setImages(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des images:", error);
    }
  };

  useEffect(() => {
    if (open && animalId) {
      fetchImages();
    }
  }, [open, animalId]);

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/animal/${animalId}/images/`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            // Retirez Content-Type pour laisser le navigateur le définir avec le bon boundary
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Upload failed");
      }

      const newImage = await response.json();
      setImages((prev) => [...prev, newImage]);
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      alert("Erreur lors de l'upload de l'image");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imageId) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/animal/image/${imageId}/`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      if (response.ok) {
        setImages((prev) => prev.filter((img) => img.id !== imageId));
      }
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleImageClick = (img) => {
    setFullscreenImage(img);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length === 0) return;

    // Gérer chaque fichier
    for (const file of files) {
      if (!file.type.startsWith("image/")) continue;

      const formData = new FormData();
      formData.append("image", file);
      setUploading(true);

      try {
        const response = await fetch(
          `http://127.0.0.1:8000/api/animal/${animalId}/images/`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
            body: formData,
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Upload failed");
        }

        const newImage = await response.json();
        setImages((prev) => [...prev, newImage]);
      } catch (error) {
        console.error("Erreur lors de l'upload:", error);
        alert("Erreur lors de l'upload de l'image");
      } finally {
        setUploading(false);
      }
    }
  };

  return (
    <>
      <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
        <DialogTitle className="bg-gray-50 border-b px-6 py-4">
          Photos de {animalName}
        </DialogTitle>
        <DialogContent className="p-6">
          <div
            className={`space-y-4 ${
              isDragging
                ? "bg-blue-50 border-2 border-dashed border-blue-400"
                : ""
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="text-center p-4">
              <input
                type="file"
                accept="image/*"
                onChange={handleUpload}
                className="hidden"
                id="image-upload"
                disabled={uploading}
                multiple
              />
              <label
                htmlFor="image-upload"
                className="inline-block px-4 py-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
              >
                {uploading ? "Upload en cours..." : "Ajouter une photo"}
              </label>
              <p className="mt-2 text-sm text-gray-500">
                ou glissez-déposez vos images ici
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 mt-4">
              {images.map((img) => (
                <div key={img.id} className="relative group">
                  <img
                    src={img.url}
                    alt=""
                    className="w-full h-48 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105"
                    onClick={() => handleImageClick(img)}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation(); // Empêche le déclenchement du onClick de l'image
                      handleDelete(img.id);
                    }}
                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <DeleteIcon />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
        <DialogActions className="px-6 py-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
          >
            Fermer
          </button>
        </DialogActions>
      </Dialog>

      {/* Dialog plein écran pour l'image */}
      <Dialog
        open={!!fullscreenImage}
        onClose={() => setFullscreenImage(null)}
        maxWidth="xl"
        fullWidth
      >
        <DialogContent className="relative p-0 bg-black flex items-center justify-center min-h-[80vh]">
          {fullscreenImage && (
            <>
              <img
                src={fullscreenImage.url}
                alt=""
                className="max-h-[80vh] max-w-full object-contain"
              />
              <button
                onClick={() => setFullscreenImage(null)}
                className="absolute top-4 right-4 text-white bg-gray-800 rounded-full p-2 hover:bg-gray-700 transition-colors"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

//DataGrid
const AnimalTable = ({ animals, onRowUpdate }) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const [searchText, setSearchText] = useState("");
  const [faDialogOpen, setFaDialogOpen] = useState(false);
  const [selectedFa, setSelectedFa] = useState(null);
  const [statuts, setStatuts] = useState([]);
  const [imageDialogOpen, setImageDialogOpen] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);

  const handleFaClick = async (faId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/fa/`, {
        // Modifié l'URL
        method: "GET", // Retour à GET
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        const faDataList = await response.json();
        const faData = faDataList.find((fa) => fa.id_fa === faId); // Chercher la FA spécifique
        if (faData) {
          setSelectedFa(faData);
          setFaDialogOpen(true);
        }
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des données FA:", error);
    }
  };

  const handleImageDialog = (animal) => {
    setSelectedAnimal({
      id: animal.id_animal, // Assurez-vous d'utiliser id_animal
      nom_animal: animal.nom_animal,
    });
    setImageDialogOpen(true);
  };

  useEffect(() => {
    const fetchStatuts = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/animal/statut/",
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        if (response.ok) {
          const data = await response.json();
          setStatuts(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des statuts:", error);
      }
    };
    fetchStatuts();
  }, [accessToken]);

  const filteredRows = animals.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      field: "nom_animal",
      headerName: "Nom",
      flex: 0.8,
      minWidth: 100,
      renderCell: (params) => (
        <div
          className="w-[calc(100%-8px)] mx-auto cursor-pointer group rounded-md hover:bg-indigo-50 
        transition-all duration-200 flex items-center justify-between gap-1 px-2 py-0.5"
          onClick={() => handleImageDialog(params.row)}
        >
          <span className="font-medium text-gray-700 group-hover:text-indigo-600 truncate">
            {params.value}
          </span>
          <div
            className="bg-indigo-100 w-5 h-5 rounded-full flex items-center justify-center 
          opacity-50 group-hover:opacity-100 transform group-hover:scale-110 transition-all duration-200"
          >
            <ImageIcon
              sx={{
                fontSize: 14,
                color: "#4f46e5",
              }}
            />
          </div>
        </div>
      ),
    },
    {
      field: "date_arrivee",
      headerName: "Arrivée",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return params.value;
      },
    },
    {
      field: "date_naissance",
      headerName: "Naissance",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return params.value;
      },
    },
    {
      field: "num_identification",
      headerName: "ID#",
      flex: 0.9,
      minWidth: 100,
    },
    {
      field: "primo_vacc",
      headerName: "1er Vacc",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return params.value;
      },
    },
    {
      field: "rappel_vacc",
      headerName: "Rappel",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return params.value;
      },
    },
    {
      field: "vermifuge",
      headerName: "Vermif.",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return params.value;
      },
    },
    {
      field: "antipuce",
      headerName: "Anti-p.",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => {
        if (!params || !params.value) return "";
        return params.value;
      },
    },
    {
      field: "sterilise",
      headerName: "Stér.",
      flex: 0.5,
      minWidth: 70,
      type: "boolean",
    },
    {
      field: "biberonnage",
      headerName: "Bib.",
      flex: 0.5,
      minWidth: 70,
      type: "boolean",
    },
    {
      field: "statut_libelle",
      headerName: "Statut",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => {
        const currentStatut =
          params.row.statut?.libelle_statut || params.row.statut_libelle || "";

        return (
          <Select
            value={currentStatut}
            size="small"
            sx={{
              fontSize: "0.875rem",
              height: "28px",
              width: "100%",
              backgroundColor: "white",
              "& .MuiSelect-select": {
                padding: "4px 8px",
                fontWeight: "600",
                color: "#374151",
                display: "block",
                textAlign: "center",
              },
              "&:hover": {
                backgroundColor: "#f3f4f6",
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #d1d5db",
              },
            }}
            onChange={(e) => {
              const selectedStatut = statuts.find(
                (s) => s.libelle_statut === e.target.value
              );
              const updatedRow = {
                ...params.row,
                statut: selectedStatut,
                statut_libelle: selectedStatut.libelle_statut,
              };
              params.api.updateRows([updatedRow]);
              onRowUpdate(updatedRow, params.row);
            }}
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 200,
                },
              },
            }}
          >
            <MenuItem value="" disabled>
              Sélectionner un statut
            </MenuItem>
            {statuts.map((statut) => (
              <MenuItem
                key={statut.id_statut}
                value={statut.libelle_statut}
                selected={currentStatut === statut.libelle_statut}
                sx={{
                  fontSize: "0.875rem",
                  "&.Mui-selected": {
                    backgroundColor: "#e5e7eb",
                    fontWeight: "600",
                  },
                  "&:hover": {
                    backgroundColor: "#f3f4f6",
                  },
                }}
              >
                {statut.libelle_statut}
              </MenuItem>
            ))}
          </Select>
        );
      },
    },
    {
      field: "provenance_libelle",
      headerName: "Prov.",
      flex: 0.8,
      minWidth: 90,
    },
    { field: "categorie_libelle", headerName: "Cat.", flex: 0.7, minWidth: 80 },
    { field: "sexe_libelle", headerName: "Sexe", flex: 0.6, minWidth: 70 },
    {
      field: "fa_libelle",
      headerName: "FA",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => {
        if (!params.value) return "";
        return (
          <div
            className="px-2 py-1 bg-purple-50 text-gray-900 rounded-md hover:bg-purple-100 
            transition-all duration-200 cursor-pointer flex items-center gap-1 
            hover:shadow-sm active:bg-purple-200 group w-full justify-center"
            onClick={() => handleFaClick(params.row.id_fa)}
          >
            <span className="text-sm font-medium group-hover:text-gray-900">
              {params.value}
            </span>
            <svg
              className="w-3 h-3 opacity-0 -translate-x-1 group-hover:opacity-100 
              group-hover:translate-x-0 transition-all duration-200 text-gray-900"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        );
      },
    },
  ].map((column) => ({
    ...column,
    editable:
      column.field !== "fa_libelle" &&
      column.field !== "statut_libelle" &&
      column.field !== "provenance_libelle" &&
      column.field !== "categorie_libelle" &&
      column.field !== "sexe_libelle",
    headerClassName: "super-app-theme--header",
    headerAlign: "center",
    align: "center",
  }));

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      const changedFields = {};
      Object.keys(newRow).forEach((key) => {
        if (newRow[key] !== oldRow[key]) {
          changedFields[key] = newRow[key];
        }
      });

      // Vérifier si le statut change pour "refuge"
      if (newRow.statut?.libelle_statut.toLowerCase() === "refuge") {
        // Supprimer immédiatement la ligne des deux états
        setAnimals((prev) => prev.filter((animal) => animal.id !== newRow.id));
        setFilteredAnimals((prev) =>
          prev.filter((animal) => animal.id !== newRow.id)
        );

        // Envoyer la mise à jour au serveur
        changedFields.statut = newRow.statut.id_statut;
        await fetch(`http://127.0.0.1:8000/api/animal/${newRow.id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(changedFields),
        });

        return null; // Retourner null pour indiquer la suppression
      }

      if (newRow.statut?.id_statut !== oldRow.statut?.id_statut) {
        changedFields.statut = newRow.statut.id_statut;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/animal/${newRow.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(changedFields),
        }
      );

      if (!response.ok) throw new Error("Échec de la mise à jour");

      const data = await response.json();

      const updatedRow = {
        ...oldRow,
        ...changedFields,
        id: oldRow.id,
        statut_libelle:
          data.statut?.libelle_statut || newRow.statut?.libelle_statut,
        statut: {
          id_statut: data.statut?.id_statut || newRow.statut?.id_statut,
          libelle_statut:
            data.statut?.libelle_statut || newRow.statut?.libelle_statut,
        },
      };

      setAnimals((prev) =>
        prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );
      setFilteredAnimals((prev) =>
        prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
      );

      return updatedRow;
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      return oldRow;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex">
        <input
          type="text"
          placeholder="Rechercher..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          className="p-2 border border-gray-300 rounded-lg w-full max-w-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>
      <div
        style={{ height: 700, width: "100%" }}
        className="border border-gray-200 rounded-lg overflow-hidden"
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: { pageSize: 15 },
            columns: { columnVisibilityModel: {} },
          }}
          pageSizeOptions={[15, 30, 50]}
          disableSelectionOnClick
          density="compact"
          processRowUpdate={onRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          sx={{
            backgroundColor: "white",
            "& .super-app-theme--header": {
              backgroundColor: "#f8fafc",
              fontSize: "0.85rem",
              fontWeight: "900",
              color: "#0f172a",
              borderRight: "1px solid #cbd5e1",
              borderBottom: "2px solid #64748b",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
              padding: "8px 6px",
              textShadow: "0 0 1px rgba(15, 23, 42, 0.1)",
              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.75rem",
              padding: "4px 6px",
              borderRight: "1px solid #cbd5e1",
              borderBottom: "1px solid #cbd5e1",
            },
            "& .MuiDataGrid-row": {
              "&:nth-of-type(even)": {
                backgroundColor: "#ffffff",
              },
              "&:nth-of-type(odd)": {
                backgroundColor: "#e2e8f0",
              },
              "&:hover": {
                backgroundColor: "#cbd5e1 !important",
                cursor: "pointer",
              },
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "2px solid #cbd5e1",
              backgroundColor: "#e2e8f0",
            },
            "& .MuiDataGrid-footerContainer": {
              borderTop: "2px solid #e2e8f0",
              backgroundColor: "#f8fafc",
            },
          }}
        />
      </div>
      <FaDialog
        open={faDialogOpen}
        onClose={() => setFaDialogOpen(false)}
        faData={selectedFa}
      />
      <ImageDialog
        open={imageDialogOpen}
        onClose={() => setImageDialogOpen(false)}
        animalId={selectedAnimal?.id}
        animalName={selectedAnimal?.nom_animal}
      />
    </div>
  );
};

function Refuge() {
  const [animals, setAnimals] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const location = useLocation();

  useEffect(() => {
    const fetchAnimals = async () => {
      try {
        if (!accessToken) {
          console.error("Pas de token d'accès");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/animal/", {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: "include",
        });

        if (response.ok) {
          const data = await response.json();
          console.log("Données brutes reçues:", data);

          // Filtrer pour exclure les animaux avec statut "refuge"
          const nonRefugeAnimals = data
            .filter(
              (animal) =>
                animal.statut?.libelle_statut.toLowerCase() !== "refuge"
            )
            .map((animal) => ({
              ...animal,
              id: animal.id_animal,
              statut_libelle: animal.statut?.libelle_statut || "",
              statut: {
                id_statut: animal.statut?.id_statut,
                libelle_statut: animal.statut?.libelle_statut,
              },
              provenance_libelle: animal.provenance?.libelle_provenance || "",
              categorie_libelle: animal.categorie?.libelle_categorie || "",
              sexe_libelle: animal.sexe?.libelle_sexe || "",
              fa_libelle: animal.fa?.prenom_fa || "",
              id_fa: animal.fa?.id_fa || null,
            }));

          console.log("Animaux non-refuge:", nonRefugeAnimals);
          setAnimals(nonRefugeAnimals);
          setFilteredAnimals(nonRefugeAnimals);
        } else {
          throw new Error(`Réponse non OK: ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur:", error);
      }
    };

    fetchAnimals();
  }, [accessToken]);

  const isMainPage = location.pathname === "/refuge";

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      const changedFields = {};
      Object.keys(newRow).forEach((key) => {
        if (newRow[key] !== oldRow[key]) {
          changedFields[key] = newRow[key];
        }
      });

      // Vérifier si le statut change pour "refuge"
      if (newRow.statut?.libelle_statut.toLowerCase() === "refuge") {
        // Supprimer immédiatement la ligne des deux états
        setAnimals((prev) => prev.filter((animal) => animal.id !== newRow.id));
        setFilteredAnimals((prev) =>
          prev.filter((animal) => animal.id !== newRow.id)
        );

        // Envoyer la mise à jour au serveur
        changedFields.statut = newRow.statut.id_statut;
        await fetch(`http://127.0.0.1:8000/api/animal/${newRow.id}/`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(changedFields),
        });

        return null; // Retourner null pour indiquer la suppression
      }

      if (newRow.statut?.id_statut !== oldRow.statut?.id_statut) {
        changedFields.statut = newRow.statut.id_statut;
      }

      const response = await fetch(
        `http://127.0.0.1:8000/api/animal/${newRow.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(changedFields),
        }
      );

      if (response.ok) {
        const data = await response.json();

        // Si l'animal a été supprimé (adopté)
        if (data.message && data.message.includes("archivé")) {
          // Mettre à jour immédiatement les deux états
          setAnimals((prev) =>
            prev.filter((animal) => animal.id !== newRow.id)
          );
          setFilteredAnimals((prev) =>
            prev.filter((animal) => animal.id !== newRow.id)
          );
          return null;
        }

        // Pour les autres mises à jour
        const updatedRow = {
          ...newRow,
          ...data,
          id: newRow.id,
          statut: data.statut || newRow.statut,
          statut_libelle: data.statut?.libelle_statut || newRow.statut_libelle,
        };

        // Mettre à jour les deux états
        setAnimals((prev) =>
          prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
        );
        setFilteredAnimals((prev) =>
          prev.map((row) => (row.id === updatedRow.id ? updatedRow : row))
        );

        return updatedRow;
      }
      throw new Error("Échec de la mise à jour");
    } catch (error) {
      console.error("Erreur:", error);
      return oldRow;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar />
      </div>
      <div className="flex-grow flex flex-col md:pl-64 relative z-0">
        <main className="flex-grow p-4 mt-16 md:mt-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              Famille d'accueil
            </h1>
            <p className="text-sm text-gray-500">
              Gestion des animaux en famille d'accueil
            </p>
          </div>
          {isMainPage && (
            <AnimalTable
              animals={filteredAnimals}
              onRowUpdate={handleRowUpdate}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default Refuge;
