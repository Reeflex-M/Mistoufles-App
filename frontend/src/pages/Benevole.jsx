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
    { field: 'id', headerName: 'ID', width: 50, editable: false },
    { 
      field: 'prenom_fa', 
      headerName: 'Prénom', 
      width: 100,
      editable: true,
    },
    { 
      field: 'nom_fa', 
      headerName: 'Nom', 
      width: 100,
      editable: true,
    },
    { 
      field: 'adresse_fa', 
      headerName: 'Adresse', 
      width: 200,
      editable: true,
    },
    { 
      field: 'commune_fa', 
      headerName: 'Commune', 
      width: 100,
      editable: true,
    },
    { 
      field: 'code_postal_fa', 
      headerName: 'Code Postal', 
      width: 100,
      editable: true,
    },
    { 
      field: 'telephone_fa', 
      headerName: 'Tél', 
      width: 130,
      editable: true,
    },
    { 
      field: 'email_fa', 
      headerName: 'Email', 
      width: 200,
      editable: true,
    },
    { 
      field: 'libelle_reseausociaux', 
      headerName: 'Réseaux', 
      width: 120,
      editable: true,
    },
    { 
      field: 'libelle_veterinaire', 
      headerName: 'Véto', 
      width: 120,
      editable: true,
    },
    { 
      field: 'note', 
      headerName: 'Notes', 
      width: 150, 
      flex: 1,
      editable: true,
    }
  ];

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
            pagination: {
              pageSize: 15,
            },
          }}
          pageSizeOptions={[15, 30, 50]}
          disableSelectionOnClick
          density="compact"
          processRowUpdate={onRowUpdate}
          experimentalFeatures={{ newEditingApi: true }}
          sx={{ 
            backgroundColor: 'white',
            border: '1px solid #e5e7eb',
            '& .MuiDataGrid-cell': {
              fontSize: '0.875rem',
              padding: '8px',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#f3f4f6',
              borderBottom: '2px solid #d1d5db',
              '& .MuiDataGrid-columnHeader': {
                borderRight: '1px solid #d1d5db'
              }
            },
            '& .MuiDataGrid-columnSeparator': {
              display: 'none'
            },
            '& .MuiDataGrid-footerContainer': {
              borderTop: '2px solid #e5e7eb'
            },
            '& .MuiDataGrid-row': {
              '&:hover': {
                backgroundColor: '#f8fafc'
              },
              '&.Mui-selected': {
                backgroundColor: 'transparent',
                '&:hover': {
                  backgroundColor: '#f8fafc'
                }
              }
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
        <main className="flex-grow p-8">
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
