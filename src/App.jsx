import React, { useEffect, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { motion } from "framer-motion";
import collimg from "./assets/coll.png"

const Navbar = () => {
  const [photoURL, setPhotoURL] = useState("");
  const [userEmail, setUserEmail] = useState(""); // Stocker l'email de l'utilisateur
  const navigate = useNavigate();
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setPhotoURL(user.photoURL || ""); // Mettre à jour l'image de profil
        setUserEmail(user.email || ""); // Mettre à jour l'email
      } else {
        setPhotoURL("");
        setUserEmail("");
      }
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 bg-white py-4">
      <nav className="container mx-auto flex justify-between items-center px-2">
        {/* Logo */}
        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <img src={collimg} alt="Logo" className="w-70 h-20" />
          <h1 className="text-black font-bold text-2xl tracking-widest px-4">
            Centre d’aide et de pratique en Informatique
          </h1>
        </motion.div>

        {/* Navigation Links */}
        <ul className="flex items-center space-x-8">
          <NavLink
            to="/profile"
            className={({ isActive }) =>
              isActive
                ? "text-black font-bold text-xl tracking-wide rounded hover:text-blue-400"
                : "text-black font-medium text-xl tracking-wide rounded hover:text-blue-400"
            }
          >
            Profil
          </NavLink>

          {["wmbennabi05@gmail.com", "dany123@gmail.com"].includes(userEmail) && (
  <NavLink
    to="/task-form"
    className={({ isActive }) =>
      isActive
        ? "text-black font-bold text-xl tracking-wide rounded hover:text-blue-400"
        : "text-black font-medium text-xl tracking-wide rounded hover:text-blue-400"
    }
  >
    Tâches
  </NavLink>
          )}

          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              isActive
                ? "text-black font-bold text-xl tracking-wide rounded hover:text-blue-400"
                : "text-black font-medium text-xl tracking-wide rounded hover:text-blue-400"
            }
          >
            Mon Espace
          </NavLink>
          <NavLink
            to="/history"
            className={({ isActive }) =>
              isActive
                ? "text-black font-bold text-xl tracking-wide rounded hover:text-blue-400"
                : "text-black font-medium text-xl tracking-wide rounded hover:text-blue-400"
            }
          >
            Historique
          </NavLink>

          {/* Afficher l'image de profil */}
          {photoURL && (
            <img
              src={photoURL}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          )}

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="ml-10 px-6 py-4 text-white bg-blue-500 rounded-lg shadow hover:bg-white hover:text-blue-500 transition-all"
>
            Déconnexion
          </button>
        </ul>
      </nav>
    </header>
  );
};

export default Navbar;
