import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { Pie, Bar } from "react-chartjs-2";
import { ACCESS_TOKEN } from "../constants";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title
);

function Stats() {
  const [archiveData, setArchiveData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchArchiveData = async () => {
      try {
        const response = await fetch(
          "http://127.0.0.1:8000/api/animal/archive/",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem(ACCESS_TOKEN)}`,
            },
          }
        );

        if (!response.ok)
          throw new Error("Erreur lors de la récupération des données");

        const data = await response.json();
        setArchiveData(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArchiveData();
  }, []);

  // Préparation des données pour le graphique des motifs d'archivage
  const motifData = {
    labels: ["Adoption", "Décès", "Autre"],
    datasets: [
      {
        data: [
          archiveData.filter(
            (item) => item.motif_archive?.libelle_motif === "Adoption"
          ).length,
          archiveData.filter(
            (item) => item.motif_archive?.libelle_motif === "Décès"
          ).length,
          archiveData.filter(
            (item) =>
              !["Adoption", "Décès"].includes(item.motif_archive?.libelle_motif)
          ).length,
        ],
        backgroundColor: ["#4ade80", "#f87171", "#fbbf24"],
        borderColor: ["#22c55e", "#ef4444", "#f59e0b"],
        borderWidth: 1,
      },
    ],
  };

  // Préparation des données pour le graphique des adoptions par mois
  const getMonthlyAdoptions = () => {
    const monthlyData = {};
    archiveData
      .filter((item) => item.motif_archive?.libelle_motif === "Adoption")
      .forEach((item) => {
        const date = new Date(item.date_archive);
        const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + 1;
      });

    return {
      labels: Object.keys(monthlyData),
      datasets: [
        {
          label: "Nombre d'adoptions",
          data: Object.values(monthlyData),
          backgroundColor: "#60a5fa",
          borderColor: "#3b82f6",
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading)
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="text-gray-600">Chargement des statistiques...</div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex-grow flex justify-center items-center">
          <div className="text-red-600">Erreur: {error}</div>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow flex flex-col md:pl-64">
        <main className="flex-grow p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Statistiques</h1>
            <p className="text-gray-600 mt-2">Statistiques du refuge</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Graphique des motifs d'archivage */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">
                Répartition des motifs d'archivage
              </h2>
              <div className="h-[300px] flex justify-center">
                <Pie
                  data={motifData}
                  options={{ maintainAspectRatio: false }}
                />
              </div>
            </div>

            {/* Graphique des adoptions par mois */}
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4">Adoptions par mois</h2>
              <div className="h-[300px]">
                <Bar
                  data={getMonthlyAdoptions()}
                  options={{
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          stepSize: 1,
                        },
                      },
                    },
                  }}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Stats;
