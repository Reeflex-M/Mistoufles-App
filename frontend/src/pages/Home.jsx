import Navbar from "../components/Navbar";

function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex-grow flex flex-col md:pl-64">
        <main className="flex-grow p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-800">
              Bienvenue sur Mistoufles App
            </h1>
            <p className="text-gray-600 mt-2">
              Gérez votre refuge en toute simplicité
            </p>
          </div>
        </main>

        <footer className="text-center py-4 text-gray-600 border-t border-gray-200">
          &copy; 2023 Mistoufles App
        </footer>
      </div>
    </div>
  );
}

export default Home;
