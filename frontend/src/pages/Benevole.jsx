import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { ACCESS_TOKEN } from "../constants";
import axios from "axios";
import PropTypes from "prop-types";

//composant NoteDialog
const NoteDialog = ({ isOpen, onClose, note = "", onSave }) => {
  const [noteText, setNoteText] = useState(note || "");

  useEffect(() => {
    setNoteText(note || "");
  }, [note]);

  const handleSave = () => {
    onSave(noteText);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="fixed inset-0 bg-black bg-opacity-50" onClick={onClose} />
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 relative z-10">
        <h2 className="text-xl font-bold mb-4">Modifier la note</h2>
        <textarea
          className="w-full h-48 p-2 border rounded-lg mb-4 focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          value={noteText}
          onChange={(e) => setNoteText(e.target.value)}
          placeholder="Ajoutez votre note ici..."
        />
        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors"
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors"
            onClick={handleSave}
          >
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
};

NoteDialog.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  note: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};

const BenevoleTable = ({ fas, onRowUpdate, setFilteredFas, setFas }) => {
  const [searchText, setSearchText] = useState("");
  const [isNoteDialogOpen, setIsNoteDialogOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState({ id: null, note: "" });

  const handleNoteClick = (id, note) => {
    setSelectedNote({
      id,
      note: note || "",
    });
    setIsNoteDialogOpen(true);
  };

  const handleNoteSave = async (newNote) => {
    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/fa/${selectedNote.id}/`,
        { note: newNote },
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );

      if (response.status === 200) {
        const updateFunc = (prev) =>
          prev.map((row) =>
            row.id === selectedNote.id ? { ...row, note: newNote } : row
          );

        setFilteredFas(updateFunc);
        setFas(updateFunc);
        setIsNoteDialogOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce bénévole ?")) {
      return;
    }

    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/fa/${id}/delete/`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
          },
        }
      );

      if (response.status === 204) {
        const filterFunc = (prev) => prev.filter((row) => row.id !== id);
        setFilteredFas(filterFunc);
        setFas(filterFunc);
      }
    } catch (error) {
      if (error.response?.status === 400) {
        alert("Impossible de supprimer un bénévole qui a des animaux associés");
      } else {
        console.error("Erreur lors de la suppression:", error);
        alert("Une erreur est survenue lors de la suppression");
      }
    }
  };

  const filteredRows = fas.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    { field: "prenom_fa", headerName: "Prénom", flex: 0.5, minWidth: 80 },
    { field: "commune_fa", headerName: "Commune", flex: 0.5, minWidth: 80 },
    { field: "telephone_fa", headerName: "Tél", flex: 0.5, minWidth: 100 },
    { field: "email_fa", headerName: "Email", flex: 0.8, minWidth: 120 },
    {
      field: "nombre_animaux",
      headerName: "Nb Animaux",
      flex: 0.4,
      minWidth: 60,
      editable: false,
      type: "number",
    },
    {
      field: "libelle_reseausociaux",
      headerName: "RS",
      flex: 0.4,
      minWidth: 60,
    },
    {
      field: "libelle_veterinaire",
      headerName: "Véto",
      flex: 0.5,
      minWidth: 80,
    },
    {
      field: "note",
      headerName: "Notes",
      flex: 0.4,
      minWidth: 80,
      editable: false,
      renderCell: (params) => (
        <div className="flex items-center justify-center w-full">
          <button
            onClick={() => handleNoteClick(params.row.id_fa, params.value)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-colors
              ${
                params.value
                  ? "bg-purple-100 text-purple-700 hover:bg-purple-200"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            title={params.value ? "Modifier la note" : "Ajouter une note"}
          >
            {params.value ? "Modifier" : "Ajouter"}
          </button>
        </div>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <button
          onClick={() => handleDelete(params.row.id_fa)}
          className="px-3 py-1 bg-red-100 text-red-700 hover:bg-red-200 rounded-md text-sm font-medium transition-colors"
          title="Supprimer le bénévole"
        >
          Supprimer
        </button>
      ),
    },
  ].map((column) => ({
    ...column,
    editable:
      column.editable !== false &&
      column.field !== "actions" &&
      column.field !== "note" &&
      column.field !== "nombre_animaux",
    headerClassName: "super-app-theme--header",
    headerAlign: "center",
    align: "center",
    // N'applique le renderCell par défaut que si la colonne n'a pas déjà un renderCell personnalisé
    ...(column.renderCell
      ? {}
      : {
          renderCell: (params) => (
            <div title={params.value} className="truncate w-full text-center">
              {params.value}
            </div>
          ),
        }),
  }));

  return (
    <div className="space-y-4">
      <NoteDialog
        isOpen={isNoteDialogOpen}
        onClose={() => setIsNoteDialogOpen(false)}
        note={selectedNote.note}
        onSave={handleNoteSave}
      />
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
        style={{ height: 510, width: "100%" }} // Modification de 700px à 600px
        className="border border-gray-200 rounded-lg overflow-hidden relative z-0"
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: { paginationModel: { pageSize: 15 } },
            columns: { columnVisibilityModel: {} },
          }}
          pageSizeOptions={[15, 30, 50, 100]}
          disableSelectionOnClick
          density="compact"
          getRowId={(row) => row.id_fa} // Ajout de cette ligne
          processRowUpdate={async (newRow, oldRow) => {
            try {
              const updatedRow = await onRowUpdate(newRow, oldRow);
              return updatedRow;
            } catch (error) {
              console.error("Erreur lors de la mise à jour:", error);
              return oldRow;
            }
          }}
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
    </div>
  );
};

BenevoleTable.propTypes = {
  fas: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      prenom_fa: PropTypes.string,
      nom_fa: PropTypes.string,
      adresse_fa: PropTypes.string,
      commune_fa: PropTypes.string,
      code_postal_fa: PropTypes.string,
      telephone_fa: PropTypes.string,
      email_fa: PropTypes.string,
      libelle_reseausociaux: PropTypes.string,
      libelle_veterinaire: PropTypes.string,
      note: PropTypes.string,
    })
  ).isRequired,
  onRowUpdate: PropTypes.func.isRequired,
  setFilteredFas: PropTypes.func.isRequired,
  setFas: PropTypes.func.isRequired,
};

function Benevole() {
  const [fas, setFas] = useState([]);
  const [filteredFas, setFilteredFas] = useState([]);
  const [fasWithoutAnimals, setFasWithoutAnimals] = useState([]); // Nouveau state
  const [showOnlyUnassigned, setShowOnlyUnassigned] = useState(false); // Toggle pour filtrer
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const location = useLocation();

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        if (!accessToken) {
          console.error("Pas de token d'accès");
          return;
        }

        // Fetch tous les FAs
        const responseFas = await fetch(
          `${import.meta.env.VITE_API_URL}/api/fa/`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          }
        );

        // Fetch FAs sans animaux
        const responseUnassigned = await fetch(
          `${import.meta.env.VITE_API_URL}/api/fa/unassigned/`,
          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            credentials: "include",
          }
        );

        if (responseFas.ok && responseUnassigned.ok) {
          const allFasData = await responseFas.json();
          const unassignedFasData = await responseUnassigned.json();

          const fasWithId = allFasData.map((fa) => ({
            ...fa,
            id: fa.id_fa,
          }));

          setFas(fasWithId);
          setFilteredFas(fasWithId);
          setFasWithoutAnimals(unassignedFasData);
        }
      } catch (error) {
        console.error("Erreur détaillée:", error);
      }
    };

    fetchAllData();
  }, [accessToken]);

  // Ajouter cette fonction pour gérer le toggle
  const handleToggleUnassigned = () => {
    setShowOnlyUnassigned(!showOnlyUnassigned);
    if (!showOnlyUnassigned) {
      const unassignedWithId = fasWithoutAnimals.map((fa) => ({
        ...fa,
        id: fa.id_fa,
      }));
      setFilteredFas(unassignedWithId);
    } else {
      setFilteredFas(fas);
    }
  };

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      console.log("Mise à jour:", newRow); // Debug
      const changedFields = {};
      Object.keys(newRow).forEach((key) => {
        if (newRow[key] !== oldRow[key]) {
          changedFields[key] = newRow[key];
        }
      });

      if (Object.keys(changedFields).length === 0) return oldRow;

      const response = await axios.patch(
        `${import.meta.env.VITE_API_URL}/api/fa/${newRow.id_fa}/`, // Changement ici: newRow.id -> newRow.id_fa
        changedFields,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.status === 200) {
        const updatedData = response.data;
        const updatedRow = { ...newRow, ...updatedData };
        console.log("Données mises à jour:", updatedRow); // Debug

        setFas((prev) =>
          prev.map((row) => (row.id_fa === updatedRow.id_fa ? updatedRow : row))
        );
        setFilteredFas((prev) =>
          prev.map((row) => (row.id_fa === updatedRow.id_fa ? updatedRow : row))
        );

        return updatedRow;
      }
      throw new Error("Mise à jour échouée");
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      return oldRow;
    }
  };

  const isMainPage = location.pathname === "/benevole";

  return (
    <div className="flex-grow flex flex-col">
      <main className="flex-grow p-4 mt-16 md:mt-0">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Bénévole</h1>
          <p className="text-sm text-gray-500">
            Gestion des bénévoles de l&apos;association
          </p>
        </div>
        {isMainPage && (
          <>
            <div className="mb-4">
              <button
                onClick={handleToggleUnassigned}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showOnlyUnassigned
                    ? "bg-purple-600 text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
              >
                {showOnlyUnassigned
                  ? "Voir tous les bénévoles"
                  : "Voir les bénévoles sans animal"}
              </button>
            </div>
            <BenevoleTable
              fas={filteredFas}
              onRowUpdate={handleRowUpdate}
              setFilteredFas={setFilteredFas}
              setFas={setFas}
            />
          </>
        )}
      </main>
    </div>
  );
}

export default Benevole;
