import Navbar from "../components/Navbar";

const PrivacyPolicy = () => {
  return (
    <div className="flex">
      <Navbar />
      <div className="flex-1 md:ml-64 p-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">
            Politique de Confidentialité - Usage Interne
          </h1>

          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                1. Utilisation des données
              </h2>
              <p>
                Dans le cadre de notre outil de gestion interne, nous collectons
                et utilisons les données suivantes :
              </p>
              <ul className="list-disc ml-6 mt-2">
                <li>Informations des bénévoles pour la gestion des équipes</li>
                <li>
                  Coordonnées professionnelles pour la communication interne
                </li>
                <li>
                  Données nécessaires à l'organisation des activités de
                  l'association
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                2. Sécurité et accès
              </h2>
              <p>Nous nous engageons à :</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Limiter l'accès aux données aux seuls membres autorisés</li>
                <li>Sécuriser les données stockées</li>
                <li>
                  Ne pas partager ces informations en dehors de l'association
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                3. Vos droits
              </h2>
              <p>En tant que membre de l'association, vous pouvez :</p>
              <ul className="list-disc ml-6 mt-2">
                <li>Accéder à vos données personnelles</li>
                <li>Demander leur mise à jour</li>
                <li>
                  Contacter la direction pour toute question relative à vos
                  données
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-700 mb-3">
                4. Contact
              </h2>
              <p>
                Pour toute question concernant l'utilisation de vos données,
                contactez la direction de l'association.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
