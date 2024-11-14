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
      const response = await fetch(`http://127.0.0.1:8000/api/fa/${faId}/`, {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        credentials: "include",
      });
      if (response.ok) {
        const faData = await response.json();
        setSelectedFa(faData);
        setFaDialogOpen(true);
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
      field: "date_naissance",
      headerName: "Naissance",
      flex: 0.9,
      minWidth: 100,
    },
    {
      field: "num_identification",
      headerName: "ID#",
      flex: 0.9,
      minWidth: 100,
    },
    { field: "primo_vacc", headerName: "1er Vacc", flex: 0.9, minWidth: 100 },
    { field: "rappel_vacc", headerName: "Rappel", flex: 0.9, minWidth: 100 },
    { field: "vermifuge", headerName: "Vermif.", flex: 0.8, minWidth: 90 },
    { field: "antipuce", headerName: "Anti-p.", flex: 0.8, minWidth: 90 },
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
      renderCell: (params) => (
        <Select
          value={params.row.statut_libelle || ""}
          size="small"
          sx={{
            fontSize: "0.75rem",
            height: "25px",
            width: "100%",
            "& .MuiSelect-select": {
              padding: "2px 8px",
            },
          }}
          onChange={(e) => {
            const selectedStatut = statuts.find(
              (s) => s.libelle_statut === e.target.value
            );
            const updatedRow = {
              ...params.row,
              statut: selectedStatut,
              statut_libelle: e.target.value,
            };
            params.api.updateRows([updatedRow]); // Met à jour visuellement la grille immédiatement
            onRowUpdate(updatedRow, params.row);
          }}
        >
          {statuts.map((statut) => (
            <MenuItem
              key={statut.id_statut}
              value={statut.libelle_statut}
              sx={{ fontSize: "0.75rem" }}
            >
              {statut.libelle_statut}
            </MenuItem>
          ))}
        </Select>
      ),
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
            className="text-blue-600 cursor-pointer hover:underline"
            onClick={() => handleFaClick(params.row.id_fa)}
          >
            {params.value}
          </div>
        );
      },
    },
  ].map((column) => ({
    ...column,
    editable: column.field !== "fa_libelle",
    headerClassName: "super-app-theme--header",
    headerAlign: "center",
    align: "center",
  }));

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
        style={{ height: 600, width: "100%" }}
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
              backgroundColor: "#f3f4f6",
              fontSize: "0.75rem",
              fontWeight: "bold",
              borderRight: "1px solid #e5e7eb",
              borderBottom: "2px solid #d1d5db",
            },
            "& .MuiDataGrid-cell": {
              fontSize: "0.75rem",
              padding: "4px",
              borderRight: "1px solid #e5e7eb",
              borderBottom: "1px solid #e5e7eb",
            },
            "& .MuiDataGrid-row": {
              "&:nth-of-type(odd)": {
                backgroundColor: "#f9fafb",
              },
              "&:hover": {
                backgroundColor: "#f3f4f6",
              },
            },
            "& .MuiDataGrid-columnHeaders": {
              borderBottom: "none",
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
          console.log("Data received:", data); // Pour debug
          const animalsWithId = data.map((animal) => ({
            ...animal,
            id: animal.id_animal,
            statut_libelle: animal.statut?.libelle_statut || "",
            provenance_libelle: animal.provenance?.libelle_provenance || "",
            categorie_libelle: animal.categorie?.libelle_categorie || "",
            sexe_libelle: animal.sexe?.libelle_sexe || "",
            fa_libelle: animal.fa?.prenom_fa || "",
            id_fa: animal.fa?.id_fa || null, // Ajout de cette ligne
          }));
          console.log("Processed animals:", animalsWithId); // Pour debug
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
      console.log("Mise à jour:", newRow); // Debug

      const response = await fetch(
        `http://127.0.0.1:8000/api/animal/${newRow.id}/`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          // Envoyer seulement l'ID du statut
          body: JSON.stringify({
            statut: newRow.statut.id_statut,
          }),
        }
      );

      if (response.ok) {
        const updatedAnimal = await response.json();
        console.log("Réponse API:", updatedAnimal); // Debug

        // Mettre à jour l'état local avec les nouvelles données
        setFilteredAnimals((prev) =>
          prev.map((row) =>
            row.id === newRow.id
              ? {
                  ...row,
                  statut: updatedAnimal.statut,
                  statut_libelle: updatedAnimal.statut?.libelle_statut,
                }
              : row
          )
        );
        return newRow;
      } else {
        throw new Error("Échec de la mise à jour");
      }
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
        <main className="flex-grow p-4">
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
