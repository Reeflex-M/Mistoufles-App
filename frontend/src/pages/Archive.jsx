import React from "react";
import Navbar from "../components/Navbar";

const Archive = () => {
  return (
    <div>
      <Navbar />
      <div className="p-8 ml-56">
        <h1 className="text-2xl font-bold mb-6">Archives</h1>
        <p>Tableau d'animaux dont statut = adopté ou décédé</p>
        <div className="bg-white rounded-lg shadow p-6">
          {/* Contenu des archives */}
        </div>
      </div>
    </div>
  );
};

export default Archive;
