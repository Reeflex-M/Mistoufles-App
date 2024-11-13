import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { DataGrid } from '@mui/x-data-grid';
import { ACCESS_TOKEN } from "../constants";
import axios from 'axios';

const BenevoleTable = ({ fas, onRowUpdate }) => {
  const [searchText, setSearchText] = useState('');

  const filteredRows = fas.filter(row => 
    Object.values(row).some(value => 
      value && value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    { field: 'prenom_fa', headerName: 'Prénom', flex: 0.5, minWidth: 80 },
    { field: 'nom_fa', headerName: 'Nom', flex: 0.5, minWidth: 80 },
    { field: 'adresse_fa', headerName: 'Adresse', flex: 0.8, minWidth: 120 },
    { field: 'commune_fa', headerName: 'Commune', flex: 0.5, minWidth: 80 },
    { field: 'code_postal_fa', headerName: 'CP', flex: 0.3, minWidth: 60 },
    { field: 'telephone_fa', headerName: 'Tél', flex: 0.5, minWidth: 100 },
    { field: 'email_fa', headerName: 'Email', flex: 0.8, minWidth: 120 },
    { field: 'libelle_reseausociaux', headerName: 'RS', flex: 0.4, minWidth: 60 },
    { field: 'libelle_veterinaire', headerName: 'Véto', flex: 0.5, minWidth: 80 },
    { field: 'note', headerName: 'Notes', flex: 0.6, minWidth: 100 }
  ].map(column => ({
    ...column,
    editable: column.editable !== false,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center',
    renderCell: (params) => (
      <div title={params.value} className="truncate w-full text-center">
        {params.value}
      </div>
    )
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
      <div style={{ height: 600, width: '100%' }} className="border border-gray-200 rounded-lg overflow-hidden relative z-0">
        <DataGrid
          rows={filteredRows}
          columns={columns}
          initialState={{
            pagination: { pageSize: 15 },
            columns: { columnVisibilityModel: {} }
          }}
          pageSizeOptions={[15, 30, 50]}
          disableSelectionOnClick
          density="compact"
          processRowUpdate={onRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          sx={{ 
            backgroundColor: 'white',
            '& .super-app-theme--header': {
              backgroundColor: '#f3f4f6',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '2px solid #d1d5db',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            },
            '& .MuiDataGrid-cell': {
              fontSize: '0.7rem',
              padding: '2px',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            },
            '& .MuiDataGrid-row': {
              '&:nth-of-type(odd)': {
                backgroundColor: '#f9fafb'
              },
              '&:hover': {
                backgroundColor: '#f3f4f6'
              }
            },
            '& .MuiDataGrid-columnHeaders': {
              borderBottom: 'none'
            }
          }}
        />
      </div>
    </div>
  );
};

function Benevole() {
  const [fas, setFas] = useState([]);
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
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include'
        });

        console.log("Token utilisé:", accessToken);
        console.log("Réponse reçue:", response);

        if (response.ok) {
          const data = await response.json();
          console.log("FA bien lu", data);
          const fasWithId = data.map(fa => ({
            ...fa,
            id: fa.id_fa
          }));
          setFas(fasWithId);
          setFilteredFas(fasWithId);
        } else {
          console.log("Statut de la réponse:", response.status);
          console.log("Headers de la réponse:", response.headers);
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
      const response = await fetch(`http://127.0.0.1:8000/api/fa/${newRow.id}/`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newRow)
      });

      if (response.ok) {
        const updatedData = await response.json();
        setFilteredFas(prev => prev.map(row => row.id === newRow.id ? {...newRow} : row));
        return newRow;
      } else {
        throw new Error('Mise à jour échouée');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return oldRow;
    }
  };

  const isMainPage = location.pathname === '/benevole';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar />
      </div>
      <div className="flex-grow flex flex-col md:pl-64 relative z-0">
        <main className="flex-grow p-4">
          {isMainPage && (
            <BenevoleTable 
              fas={filteredFas} 
              onRowUpdate={handleRowUpdate}
            />
          )}
        </main>
      </div>
    </div>
  );
}

export default Benevole;
