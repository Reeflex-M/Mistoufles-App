import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { DataGrid } from "@mui/x-data-grid";
import { ACCESS_TOKEN } from "../constants";

function Historique() {
  const [historique, setHistorique] = useState([]);
  const accessToken = localStorage.getItem(ACCESS_TOKEN);

  const columns = [
    { field: "date", headerName: "Date", flex: 1, minWidth: 120 },
    { field: "nom_animal", headerName: "Animal", flex: 1, minWidth: 120 },
    {
      field: "ancien_statut",
      headerName: "Ancien Statut",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "nouveau_statut",
      headerName: "Nouveau Statut",
      flex: 1,
      minWidth: 120,
    },
    { field: "modifie_par", headerName: "Modifié par", flex: 1, minWidth: 120 },
  ];

  useEffect(() => {
    const fetchHistorique = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8000/api/historique/", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          setHistorique(data);
        }
      } catch (error) {
        console.error("Erreur lors de la récupération de l'historique:", error);
      }
    };

    fetchHistorique();
  }, [accessToken]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar />
      </div>
      <div className="flex-grow flex flex-col md:pl-64 relative z-0">
        <main className="flex-grow p-4">
          <div style={{ height: 600, width: "100%" }}>
            <DataGrid
              rows={historique}
              columns={columns}
              pageSize={15}
              rowsPerPageOptions={[15, 30, 50]}
              disableSelectionOnClick
              density="compact"
              sx={{
                backgroundColor: "white",
                "& .MuiDataGrid-cell": {
                  borderRight: "1px solid #e5e7eb",
                },
              }}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default Historique;
