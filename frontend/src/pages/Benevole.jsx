import Navbar from "../components/Navbar";

function Benevole() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow flex flex-col md:pl-64">
        <main className="flex-grow p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Bénévoles</h1>
            <p className="text-gray-600 mt-2">Gestion des bénévoles</p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Benevole;
