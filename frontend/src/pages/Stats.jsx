import { useState, useEffect } from "react";
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
          `${import.meta.env.VITE_API_URL}/api/animal/archive/`,
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
      "Mort naturelle:",
      archiveData.filter(
        (item) => item.statut?.libelle_statut === "mort naturelle"
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
              item.statut?.libelle_statut?.toLowerCase() === "mort naturelle" &&
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

  // Ajoutez ces données de préparation pour le graphique des provenances juste après motifData
  const provenanceData = {
    labels: Array.from(
      new Set(
        archiveData
          .filter((item) => item.provenance?.libelle_provenance)
          .map((item) => item.provenance.libelle_provenance)
      )
    ),
    datasets: [
      {
        data: Array.from(
          new Set(
            archiveData
              .filter((item) => item.provenance?.libelle_provenance)
              .map((item) => item.provenance.libelle_provenance)
          )
        ).map(
          (provenance) =>
            archiveData.filter(
              (item) =>
                item.provenance?.libelle_provenance === provenance &&
                (selectedYear === "Global" ||
                  new Date(item.created_at).getFullYear() ===
                    Number(selectedYear))
            ).length
        ),
        backgroundColor: [
          "#f472b6", // rose
          "#fb923c", // orange
          "#a78bfa", // violet
          "#60a5fa", // bleu
          "#4ade80", // vert
          "#facc15", // jaune
          "#94a3b8", // gris
        ],
        borderColor: [
          "#ec4899",
          "#f97316",
          "#7c3aed",
          "#3b82f6",
          "#22c55e",
          "#eab308",
          "#64748b",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Ajouter après provenanceData
  const categorieData = {
    labels: Array.from(
      new Set(
        archiveData
          .filter((item) => item.categorie?.libelle_categorie)
          .map((item) => item.categorie.libelle_categorie)
      )
    ),
    datasets: [
      {
        data: Array.from(
          new Set(
            archiveData
              .filter((item) => item.categorie?.libelle_categorie)
              .map((item) => item.categorie.libelle_categorie)
          )
        ).map(
          (categorie) =>
            archiveData.filter(
              (item) =>
                item.categorie?.libelle_categorie === categorie &&
                (selectedYear === "Global" ||
                  new Date(item.created_at).getFullYear() ===
                    Number(selectedYear))
            ).length
        ),
        backgroundColor: [
          "#84cc16", // lime
          "#06b6d4", // cyan
          "#f43f5e", // rose
          "#8b5cf6", // violet
          "#fbbf24", // amber
        ],
        borderColor: ["#65a30d", "#0891b2", "#e11d48", "#7c3aed", "#d97706"],
        borderWidth: 1,
      },
    ],
  };

  // Remplacer la fonction getMonthlyAdoptions par celle-ci
  const getMonthlyAdoptions = () => {
    if (selectedYear === "Global") {
      return {
        labels: [],
        datasets: [
          {
            label: "Nombre d'adoptions",
            data: [],
            backgroundColor: "#60a5fa",
            borderColor: "#3b82f6",
            borderWidth: 1,
          },
        ],
      };
    }

    const monthsData = new Array(12).fill(0);
    const monthNames = [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Décembre",
    ];

    archiveData
      .filter(
        (item) =>
          item.statut?.libelle_statut?.toLowerCase() === "adopté" &&
          new Date(item.created_at).getFullYear() === Number(selectedYear)
      )
      .forEach((item) => {
        const month = new Date(item.created_at).getMonth();
        monthsData[month]++;
      });

    return {
      labels: monthNames,
      datasets: [
        {
          label: "Nombre d'adoptions",
          data: monthsData,
          backgroundColor: "#60a5fa",
          borderColor: "#3b82f6",
          borderWidth: 1,
        },
      ],
    };
  };

  // Ajouter cette nouvelle fonction après getMonthlyAdoptions
  const getYearlyAdoptions = () => {
    // Si une année spécifique est sélectionnée
    if (selectedYear !== "Global") {
      const count = archiveData.filter(
        (item) =>
          item.statut?.libelle_statut?.toLowerCase() === "adopté" &&
          new Date(item.created_at).getFullYear() === Number(selectedYear)
      ).length;

      return {
        labels: [selectedYear.toString()],
        datasets: [
          {
            label: "Nombre d'adoptions",
            data: [count],
            backgroundColor: "#4ade80",
            borderColor: "#22c55e",
            borderWidth: 1,
          },
        ],
      };
    }

    // Si "Global" est sélectionné - afficher toutes les années
    const yearlyData = {};
    archiveData
      .filter((item) => item.statut?.libelle_statut?.toLowerCase() === "adopté")
      .forEach((item) => {
        const year = new Date(item.created_at).getFullYear();
        yearlyData[year] = (yearlyData[year] || 0) + 1;
      });

    const sortedYears = Object.keys(yearlyData).sort();

    return {
      labels: sortedYears,
      datasets: [
        {
          label: "Nombre d'adoptions",
          data: sortedYears.map((year) => yearlyData[year]),
          backgroundColor: "#4ade80",
          borderColor: "#22c55e",
          borderWidth: 1,
        },
      ],
    };
  };

  if (loading)
    return (
      <div className="flex-grow flex justify-center items-center">
        <div className="text-gray-600">Chargement des statistiques...</div>
      </div>
    );

  if (error)
    return (
      <div className="flex-grow flex justify-center items-center">
        <div className="text-red-600">Erreur: {error}</div>
      </div>
    );

  return (
    <div className="flex-grow flex flex-col">
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
          {/* Graphique des adoptions par année */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Adoptions par année</h2>
            <div className="h-[300px]">
              <Bar
                data={getYearlyAdoptions()}
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
                  plugins: {
                    title: {
                      display: true,
                      text: "Évolution des adoptions par année",
                    },
                  },
                }}
              />
            </div>
          </div>

          {/* Graphique des adoptions par mois - Conditionnel */}
          {selectedYear !== "Global" && (
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
                    plugins: {
                      title: {
                        display: true,
                        text: `Adoptions par mois en ${selectedYear}`,
                      },
                    },
                  }}
                />
              </div>
            </div>
          )}

          {/* Graphique des motifs d'archivage */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Répartition des motifs d'archivage
            </h2>
            <div className="h-[300px] flex justify-center">
              <Pie data={motifData} options={{ maintainAspectRatio: false }} />
            </div>
          </div>

          {/* Ajoutez ce nouveau bloc après les deux graphiques existants */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Répartition par provenance
            </h2>
            <div className="h-[300px] flex justify-center">
              <Pie
                data={provenanceData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>

          {/* Ajouter ce nouveau bloc après les autres graphiques */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">
              Répartition par catégorie
            </h2>
            <div className="h-[300px] flex justify-center">
              <Pie
                data={categorieData}
                options={{ maintainAspectRatio: false }}
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Stats;
