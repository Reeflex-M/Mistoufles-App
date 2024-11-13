import { useState, useEffect } from "react";
import { useLocation } from 'react-router-dom';
import Navbar from "../components/Navbar";
import { DataGrid } from '@mui/x-data-grid';
import { ACCESS_TOKEN } from "../constants";

const AnimalTable = ({ animals, onRowUpdate }) => {
  const [searchText, setSearchText] = useState('');

  const filteredRows = animals.filter(row => 
    Object.values(row).some(value => 
      value && value.toString().toLowerCase().includes(searchText.toLowerCase())
    )
  );

  const columns = [
    { field: 'id', headerName: 'ID', flex: 0.3, minWidth: 50 },
    { field: 'nom_animal', headerName: 'Nom', flex: 0.6, minWidth: 80 },
    { field: 'date_naissance', headerName: 'Naissance', flex: 0.7, minWidth: 90 },
    { field: 'num_identification', headerName: 'ID#', flex: 0.7, minWidth: 90 },
    { field: 'primo_vacc', headerName: '1er Vacc', flex: 0.7, minWidth: 90 },
    { field: 'rappel_vacc', headerName: 'Rappel', flex: 0.7, minWidth: 90 },
    { field: 'vermifuge', headerName: 'Vermif.', flex: 0.6, minWidth: 80 },
    { field: 'antipuce', headerName: 'Anti-p.', flex: 0.6, minWidth: 80 },
    { field: 'sterilise', headerName: 'Stér.', flex: 0.4, minWidth: 60, type: 'boolean' },
    { field: 'biberonnage', headerName: 'Bib.', flex: 0.4, minWidth: 60, type: 'boolean' },
    { field: 'statut_libelle', headerName: 'Statut', flex: 0.6, minWidth: 80 },
    { field: 'provenance_libelle', headerName: 'Prov.', flex: 0.6, minWidth: 80 },
    { field: 'categorie_libelle', headerName: 'Cat.', flex: 0.6, minWidth: 80 },
    { field: 'sexe_libelle', headerName: 'Sexe', flex: 0.4, minWidth: 60 },
    { field: 'fa_libelle', headerName: 'FA', flex: 0.7, minWidth: 90 }
  ].map(column => ({
    ...column,
    editable: true,
    headerClassName: 'super-app-theme--header',
    headerAlign: 'center',
    align: 'center'
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
      <div style={{ height: 600, width: '100%' }} className="border border-gray-200 rounded-lg overflow-hidden">
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
              fontSize: '0.75rem',
              fontWeight: 'bold',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '2px solid #d1d5db'
            },
            '& .MuiDataGrid-cell': {
              fontSize: '0.75rem',
              padding: '4px',
              borderRight: '1px solid #e5e7eb',
              borderBottom: '1px solid #e5e7eb'
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
          method: 'GET',
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken}`,
          },
          credentials: 'include'
        });

        if (response.ok) {
          const data = await response.json();
          console.log('Data received:', data); // Pour debug
          const animalsWithId = data.map(animal => ({
            ...animal,
            id: animal.id_animal,
            statut_libelle: animal.statut?.libelle_statut || '',
            provenance_libelle: animal.provenance?.libelle_provenance || '',
            categorie_libelle: animal.categorie?.libelle_categorie || '',
            sexe_libelle: animal.sexe?.libelle_sexe || '',
            fa_libelle: animal.fa?.prenom_fa || ''
          }));
          console.log('Processed animals:', animalsWithId); // Pour debug
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

  const handleRowUpdate = async (newRow, oldRow) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/animal/${newRow.id}/`, {
        method: 'PATCH',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(newRow)
      });

      if (response.ok) {
        setFilteredAnimals(prev => prev.map(row => row.id === newRow.id ? {...newRow} : row));
        return newRow;
      } else {
        throw new Error('Mise à jour échouée');
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      return oldRow;
    }
  };

  const isMainPage = location.pathname === '/refuge';

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <div className="relative z-10">
        <Navbar />
      </div>
      <div className="flex-grow flex flex-col md:pl-64 relative z-0">
        <main className="flex-grow p-8">
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
