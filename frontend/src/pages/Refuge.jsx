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

//DataGrid
const AnimalTable = ({ animals, onRowUpdate }) => {
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const [searchText, setSearchText] = useState("");
  const [faDialogOpen, setFaDialogOpen] = useState(false);
  const [selectedFa, setSelectedFa] = useState(null);
  const [statuts, setStatuts] = useState([]);

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
    { field: "nom_animal", headerName: "Nom", flex: 0.8, minWidth: 100 },
    {
      field: "date_arrivee",
      headerName: "Arrivée",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: "date_naissance",
      headerName: "Naissance",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
        if (!params.value) return "";
        const date = new Date(params.value);
        if (date.getFullYear() === 1970) return "";
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: "rappel_vacc",
      headerName: "Rappel",
      flex: 0.9,
      minWidth: 100,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        if (date.getFullYear() === 1970) return "";
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: "vermifuge",
      headerName: "Vermif.",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        if (date.getFullYear() === 1970) return "";
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
      },
    },
    {
      field: "antipuce",
      headerName: "Anti-p.",
      flex: 0.8,
      minWidth: 90,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        if (date.getFullYear() === 1970) return "";
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
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
        // Modifier cette partie pour utiliser directement le libelle du statut
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
        if (newRow[key] !== oldRow[key] && key !== "id") {
          // Convertir les dates si nécessaire
          if (
            key === "date_naissance" ||
            key === "primo_vacc" ||
            key === "rappel_vacc" ||
            key === "vermifuge" ||
            key === "antipuce"
          ) {
            changedFields[key] = newRow[key];
          } else {
            changedFields[key] = newRow[key];
          }
        }
      });

      if (Object.keys(changedFields).length === 0) return oldRow;

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
        if (data.message === "Animal supprimé car adopté") {
          return null;
        }
        return { ...newRow, ...data };
      }
      throw new Error("Échec de la mise à jour");
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
        style={{ height: 700, width: "100%" }} // Modifié de 600 à 750 pour afficher plus de lignes
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
              borderRight: "1px solid #cbd5e1", // Bordure plus visible
              borderBottom: "2px solid #64748b",
              textTransform: "uppercase",
              letterSpacing: "0.025em",
              padding: "8px 6px", // Légèrement plus large
              textShadow: "0 0 1px rgba(15, 23, 42, 0.1)",
              "&:hover": {
                backgroundColor: "#f1f5f9",
              },
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.75rem",
              padding: "4px 6px", // Légèrement plus large
              borderRight: "1px solid #cbd5e1", // Bordure plus visible
              borderBottom: "1px solid #cbd5e1", // Bordure plus visible
            },
            "& .MuiDataGrid-row": {
              "&:nth-of-type(even)": {
                backgroundColor: "#ffffff",
              },
              "&:nth-of-type(odd)": {
                backgroundColor: "#e2e8f0", // Changé de f1f5f9 à e2e8f0 pour plus de contraste
              },
              "&:hover": {
                backgroundColor: "#cbd5e1 !important", // Changé pour un hover plus visible sur fond foncé
                cursor: "pointer",
              },
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "2px solid #cbd5e1", // Bordure plus visible
              backgroundColor: "#e2e8f0", // Slate-200 pour l'en-tête
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
          console.log("Données brutes reçues:", data); // Debug

          const animalsWithId = data.map((animal) => {
            console.log("FA data for animal:", animal.fa); // Debug
            return {
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
            };
          });

          console.log("Données transformées:", animalsWithId); // Debug
          setAnimals(animalsWithId);
          setFilteredAnimals(animalsWithId);
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
