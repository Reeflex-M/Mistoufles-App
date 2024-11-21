import Navbar from "../components/Navbar";

const Chatterie = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 p-8 md:ml-64">
        <h1 className="text-2xl font-bold mb-6">Chatterie</h1>
        {/* Ajoutez ici le contenu de votre page Chatterie */}
      </div>
    </div>
  );
};

export default Chatterie;
