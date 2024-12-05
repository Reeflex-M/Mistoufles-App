import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { ACCESS_TOKEN } from "../constants";

const ArchiveTable = ({ archives }) => {
  const [searchText, setSearchText] = useState("");

  const filteredRows = archives.filter((row) =>
    Object.values(row).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    {
      field: "created_at",
      headerName: "Date d'archivage",
      flex: 0.9,
      minWidth: 100,
    },
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
    { field: "statut_libelle", headerName: "Statut", flex: 0.8, minWidth: 90 },
    {
      field: "provenance_libelle",
      headerName: "Prov.",
      flex: 0.8,
      minWidth: 90,
    },
    { field: "categorie_libelle", headerName: "Cat.", flex: 0.7, minWidth: 80 },
    { field: "sexe_libelle", headerName: "Sexe", flex: 0.6, minWidth: 70 },
  ].map((column) => ({
    ...column,
    editable: false,
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
        style={{ height: 580, width: "100%" }}
        className="border border-gray-200 rounded-lg overflow-hidden"
      >
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: { pageSize: 15 },
          }}
          pageSizeOptions={[15, 30, 50]}
          disableSelectionOnClick
          density="compact"
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

function Archive() {
  const [archives, setArchives] = useState([]);
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  useEffect(() => {
    const fetchArchives = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_API_URL}/api/animal/archive/`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          const archivesWithId = data.map((archive) => ({
            ...archive,
            id: archive.id_animal,
            statut_libelle: archive.statut?.libelle_statut || "",
            provenance_libelle: archive.provenance?.libelle_provenance || "",
            categorie_libelle: archive.categorie?.libelle_categorie || "",
            sexe_libelle: archive.sexe?.libelle_sexe || "",
          }));
          setArchives(archivesWithId);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération des archives:", error);
      }
    };

    fetchArchives();
  }, [accessToken]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <main className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-6">Archives</h1>
        <ArchiveTable archives={archives} />
      </main>
    </div>
  );
}

export default Archive;
