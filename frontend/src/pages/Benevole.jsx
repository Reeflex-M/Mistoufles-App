import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { ACCESS_TOKEN } from "../constants";
import axios from "axios";
import PropTypes from "prop-types";

//composant NoteDialog
const NoteDialog = ({ isOpen, onClose, note, onSave }) => {
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

NoteDialog.defaultProps = {
  note: "",
};

const BenevoleTable = ({ fas, onRowUpdate, setFilteredFas }) => {
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
        `http://127.0.0.1:8000/api/fa/${selectedNote.id}/`,
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
        setFilteredFas((prev) =>
          prev.map((row) =>
            row.id === selectedNote.id ? { ...row, note: newNote } : row
          )
        );
        setIsNoteDialogOpen(false);
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
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
    { field: "nom_fa", headerName: "Nom", flex: 0.5, minWidth: 80 },
    { field: "adresse_fa", headerName: "Adresse", flex: 0.8, minWidth: 120 },
    { field: "commune_fa", headerName: "Commune", flex: 0.5, minWidth: 80 },
    { field: "code_postal_fa", headerName: "CP", flex: 0.3, minWidth: 60 },
    { field: "telephone_fa", headerName: "Tél", flex: 0.5, minWidth: 100 },
    { field: "email_fa", headerName: "Email", flex: 0.8, minWidth: 120 },
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
            onClick={() => handleNoteClick(params.row.id, params.value)}
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
  ].map((column) => ({
    ...column,
    editable: column.editable !== false,
    headerClassName: "super-app-theme--header",
    headerAlign: "center",
    align: "center",
    // N'applique le renderCell par défaut que si la colderCell personnalisé
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
        style={{ height: 700, width: "100%" }}
        className="border border-gray-200 rounded-lg overflow-hidden relative z-0"
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
};

function Benevole() {
  // eslint-disable-next-line no-unused-vars
  const [fas, setFas] = useState([]); // useful for tabs

  const [filteredFas, setFilteredFas] = useState([]);
  const accessToken = localStorage.getItem(ACCESS_TOKEN);
  const location = useLocation();

  useEffect(() => {
    const fetchFas = async () => {
      try {
        if (!accessToken) {
          console.error("Pas de token d'accès");
          return;
        }

        const response = await fetch("http://127.0.0.1:8000/api/fa/", {
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
          const fasWithId = data.map((fa) => ({
            ...fa,
            id: fa.id_fa,
          }));
          setFas(fasWithId);
          setFilteredFas(fasWithId);
        } else {
          throw new Error(`Réponse non OK: ${response.status}`);
        }
      } catch (error) {
        console.error("Erreur détaillée:", error);
      }
    };

    fetchFas();
  }, [accessToken]);

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/api/fa/${newRow.id}/`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify(newRow),
        }
      );

      if (response.ok) {
        // eslint-disable-next-line no-unused-vars
        const updatedData = await response.json();
        setFilteredFas((prev) =>
          prev.map((row) => (row.id === newRow.id ? { ...newRow } : row))
        );
        return newRow;
      } else {
        throw new Error("Mise à jour échouée");
      }
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      return oldRow;
    }
  };

  const isMainPage = location.pathname === "/benevole";

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar />
      </div>
      <div className="flex-grow flex flex-col md:pl-64 relative z-0">
        <main className="flex-grow p-4 mt-16 md:mt-0">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">Bénévole</h1>
            <p className="text-sm text-gray-500">
              Gestion des bénévoles de l'association
            </p>
          </div>{" "}
          {/* Ajout de mt-16 en mobile */}
          {isMainPage && (
            <BenevoleTable
              fas={filteredFas}
              onRowUpdate={handleRowUpdate}
              setFilteredFas={setFilteredFas}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default Benevole;
