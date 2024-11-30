import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8">
      <div className="container mx-auto px-4">
        {/* Section principale */}
        <div className="flex flex-col md:flex-row justify-between">
          {/* Section Maisonneuve */}
          <div className="mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-4">Maisonneuve</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.cmaisonneuve.qc.ca/a-propos/"
                  className="hover:underline"
                >
                  À propos
                </a>
              </li>
              <li>
                <a
                  href="https://www.cmaisonneuve.qc.ca/regles-de-confidentialite/"
                  className="hover:underline"
                >
                  Règles de confidentialité
                </a>
              </li>
              <li>
                <a
                  href="https://www.cmaisonneuve.qc.ca/medias/"
                  className="hover:underline"
                >
                  Médias
                </a>
              </li>
            </ul>
          </div>

          {/* Section Liens utiles */}
          <div className="mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-4">Liens utiles</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://intranet.cmaisonneuve.qc.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Intranet
                </a>
              </li>
              <li>
                <a
                  href="http://moodle.cmaisonneuve.qc.ca"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Moodle
                </a>
              </li>
              <li>
                <a
                  href="https://www.cmaisonneuve.qc.ca/bibliotheque/"
                  className="hover:underline"
                >
                  Bibliothèque
                </a>
              </li>
              <li>
                <a
                  href="https://cmaisonneuve.omnivox.ca/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Omnivox
                </a>
              </li>
            </ul>
          </div>

          {/* Section Où nous trouver */}
          <div className="mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-4">Où nous trouver</h4>
            <p className="text-sm">
              <strong>Campus principal</strong>
              <br />
              3800, rue Sherbrooke Est
              <br />
              Montréal (Québec) H1X 2A2
              <br />
              Consultez les{" "}
              <a
                href="https://cmais-staging.devnet.cmaisonneuve.qc.ca/campus-installations/trois-campus/3800-rue-sherbrooke/"
                className="hover:underline"
              >
                heures d'ouverture
              </a>
            </p>
          </div>

          {/* Section Nous joindre */}
          <div className="mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-4">Nous joindre</h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://www.cmaisonneuve.qc.ca/nous-joindre/"
                  className="hover:underline"
                >
                  Trouver une personne / un service
                </a>
              </li>
              <li>
                <a
                  href="https://www.cmaisonneuve.qc.ca/nous-joindre/"
                  className="hover:underline"
                >
                  Trouver un campus de formation
                </a>
              </li>
              <li>
                <a
                  href="https://www.cmaisonneuve.qc.ca/faq/"
                  className="hover:underline"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Section Suivez-nous */}
          <div className="mb-6 md:mb-0">
            <h4 className="font-bold text-lg mb-4">Suivez-nous</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/CollegeMaisonneuve"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-500"
                title="Facebook"
              >
                <i className="fab fa-facebook fa-2x"></i>
              </a>
              <a
                href="https://x.com/CdeMaisonneuve"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-400"
                title="Twitter"
              >
                <i className="fab fa-twitter fa-2x"></i>
              </a>
              <a
                href="https://www.youtube.com/user/communicmaisonneuve"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-500"
                title="YouTube"
              >
                <i className="fab fa-youtube fa-2x"></i>
              </a>
              <a
                href="http://ca.linkedin.com/company/collegedemaisonneuve"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-blue-600"
                title="LinkedIn"
              >
                <i className="fab fa-linkedin fa-2x"></i>
              </a>
              <a
                href="https://www.instagram.com/collegemaisonneuve/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-pink-500"
                title="Instagram"
              >
                <i className="fab fa-instagram fa-2x"></i>
              </a>
            </div>
          </div>
        </div>

        {/* Section Copyright */}
        <div className="mt-6 border-t border-gray-700 pt-4 text-center">
          <p>© 2024 Collège de Maisonneuve. Tous droits réservés.</p>
          <a
            href="https://www.cmaisonneuve.qc.ca/plan-du-site"
            className="hover:underline"
          >
            Plan du site
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
