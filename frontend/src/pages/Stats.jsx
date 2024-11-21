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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [availableYears, setAvailableYears] = useState([]);

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
        console.log("Données reçues:", data); // Vérifier que 'created_at' est présent
        data.forEach((item) => {
          console.log("Statut:", item.statut?.libelle_statut); // Debug chaque statut
        });
        setArchiveData(data);
        setLoading(false);
      } catch (err) {
        console.error("Erreur:", err); // Debug
        setError(err.message);
        setLoading(false);
      }
    };

    fetchArchiveData();
  }, []);

  useEffect(() => {
    // Extraire les années disponibles à partir des données
    const years = Array.from(
      new Set(
        archiveData
          .map((item) => {
            const dateStr = item.created_at;
            if (dateStr) {
              const date = new Date(dateStr);
              const year = date.getFullYear();
              return isNaN(year) ? null : year;
            }
            return null;
          })
          .filter((year) => year !== null)
      )
    ).sort((a, b) => b - a);
    setAvailableYears(["Global", ...years]);
  }, [archiveData]);

  // Log des données filtrées
  useEffect(() => {
    console.log(
      "Adoptés:",
      archiveData.filter((item) => item.statut?.libelle_statut === "adopté")
        .length
    );
    console.log(
      "Mort naturel:",
      archiveData.filter(
        (item) => item.statut?.libelle_statut === "mort naturel"
      ).length
    );
    console.log(
      "Mort euthanasie:",
      archiveData.filter(
        (item) => item.statut?.libelle_statut === "mort euthanasie"
      ).length
    );
    console.log(
      "Transfert:",
      archiveData.filter(
        (item) => item.statut?.libelle_statut === "transfert refuge"
      ).length
    );
  }, [archiveData]);

  // Préparation des données pour le graphique des motifs d'archivage
  const motifData = {
    labels: [
      "Adoption",
      "Mort Naturelle",
      "Mort Euthanasie",
      "Sortie Refuge",
      "Chat Libre",
    ],
    datasets: [
      {
        data: [
          archiveData.filter(
            (item) =>
              item.statut?.libelle_statut?.toLowerCase() === "adopté" &&
              (selectedYear === "Global" ||
                new Date(item.created_at).getFullYear() ===
                  Number(selectedYear))
          ).length,
          archiveData.filter(
            (item) =>
              item.statut?.libelle_statut?.toLowerCase() === "mort naturel" &&
              (selectedYear === "Global" ||
                new Date(item.created_at).getFullYear() ===
                  Number(selectedYear))
          ).length,
          archiveData.filter(
            (item) =>
              item.statut?.libelle_statut?.toLowerCase() ===
                "mort euthanasie" &&
              (selectedYear === "Global" ||
                new Date(item.created_at).getFullYear() ===
                  Number(selectedYear))
          ).length,
          archiveData.filter(
            (item) =>
              item.statut?.libelle_statut?.toLowerCase() ===
                "transfert refuge" &&
              (selectedYear === "Global" ||
                new Date(item.created_at).getFullYear() ===
                  Number(selectedYear))
          ).length,
          archiveData.filter(
            (item) =>
              item.statut?.libelle_statut?.toLowerCase() === "chat libre" &&
              (selectedYear === "Global" ||
                new Date(item.created_at).getFullYear() ===
                  Number(selectedYear))
          ).length,
        ],
        backgroundColor: [
          "#4ade80",
          "#f87171",
          "#fbbf24",
          "#60a5fa",
          "#a78bfa",
        ],
        borderColor: ["#22c55e", "#ef4444", "#f59e0b", "#3b82f6", "#7c3aed"],
        borderWidth: 1,
      },
    ],
  };

  // Préparation des données pour le graphique des adoptions par mois
  const getMonthlyAdoptions = () => {
    const monthlyData = {};
    archiveData
      .filter((item) => {
        if (
          item.statut?.libelle_statut?.toLowerCase() === "adopté" &&
          item.created_at
        ) {
          const itemYear = new Date(item.created_at).getFullYear();
          return selectedYear === "Global" || itemYear === Number(selectedYear);
        }
        return false;
      })
      .forEach((item) => {
        const date = new Date(item.created_at);
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        const label =
          selectedYear === "Global"
            ? `${month}/${year}`
            : `${month}/${selectedYear}`;
        monthlyData[label] = (monthlyData[label] || 0) + 1;
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

          {/* Sélecteur d'année */}
          <div className="mb-6">
            <label htmlFor="year-select" className="mr-2">
              Sélectionnez une année :
            </label>
            <select
              id="year-select"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="border border-gray-300 rounded p-1"
            >
              {availableYears.map((year) => (
                <option key={year} value={year}>
                  {year === "Global" ? "Toutes les années" : year}
                </option>
              ))}
            </select>
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
