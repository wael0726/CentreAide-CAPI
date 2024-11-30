import React, { useState, useEffect } from "react";
import { getAuth, updatePassword, updateProfile, updateEmail } from "firebase/auth";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";

const Profile = () => {
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [profilePicture, setProfilePicture] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const auth = getAuth();
  const user = auth.currentUser;
  const storage = getStorage();

  useEffect(() => {
    if (user) {
      if (user.displayName) {
        const [fName, lName] = user.displayName.split(" ");
        setFirstName(fName || "");
        setLastName(lName || "");
      }
      setEmail(user.email || "");
      if (user.photoURL) {
        setPhotoURL(user.photoURL);
      }
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      if (password) {
        await updatePassword(user, password);
        setSuccess((prev) => prev + " Password updated successfully! ");
      }

      if (firstName || lastName || profilePicture) {
        const updates = {};
        if (firstName || lastName) {
          updates.displayName = `${firstName} ${lastName}`.trim();
        }
        if (profilePicture) {
          const storageRef = ref(storage, `profilePictures/${user.uid}`);
          await uploadBytes(storageRef, profilePicture);
          const downloadURL = await getDownloadURL(storageRef);
          updates.photoURL = downloadURL;
          setPhotoURL(downloadURL);
        }
        await updateProfile(user, updates);
        setSuccess((prev) => prev + " Profile updated successfully! ");
      }

      if (email && email !== user.email) {
        await updateEmail(user, email);
        setSuccess((prev) => prev + " Email updated successfully!");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setError(error.message);
    }
  };

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400">
      {/* Section gauche : Titre, Description et Animation */}
      <div className="w-1/3 bg-gradient-to-br from-blue-500 to-purple-600 flex flex-col justify-center items-center p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Votre Espace Profil</h1>
        <p className="text-center text-lg mb-6">
          Ici, vous pouvez configurer vos informations personnelles et mettre à jour vos
          préférences de compte.
        </p>
        <dotlottie-player
          src="https://lottie.host/80208766-c731-404f-9cb6-e5e9675dea75/jpuzZFXmbb.lottie"
          background="transparent"
          speed="1"
          style={{ width: "300px", height: "300px" }}
          loop
          autoplay
        ></dotlottie-player>
      </div>

      <div className="w-2/3 flex flex-col justify-center items-center bg-white p-18">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    className="bg-gray-100 p-8 rounded-xl shadow-lg w-full max-w-4xl"
  >
    {/* Photo à gauche et texte à droite */}
    <div className="flex items-center gap-6 mb-6">
      {/* Photo à gauche */}
      <img
        src={photoURL || "https://via.placeholder.com/150"}
        alt="Profile"
        className="w-32 h-32 rounded-full border-4 border-gray-300 object-cover"
      />
      {/* Texte à droite */}
      <div>
        <p className="text-3xl font-bold text-gray-800 mb-6 text-center">
        Configuration du Profil de l'utilisateur
        </p>
      </div>
    </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Prénom</label>
                <input
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="mt-1 p-3 border rounded-md w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Nom</label>
                <input
                  type="text"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="mt-1 p-3 border rounded-md w-full"
                />
              </div>
            </div>
            <div className="flex gap-6">
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 p-3 border rounded-md w-full"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700">Mot de passe</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 p-3 border rounded-md w-full"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Photo de profil
              </label>
              <input
                type="file"
                onChange={(e) => setProfilePicture(e.target.files[0])}
                className="mt-1 p-3 border rounded-md w-full"
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md"
              >
                Enregistrer les modifications
              </button>
            </div>
          </form>

          <div className="mt-10">
  <h2 className="text-2xl font-semibold text-gray-800 mb-2">Activités récentes</h2>
  <ul className="flex gap-6">
    <li className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow">
      <div className="bg-blue-100 text-blue-500 p-2 rounded-full">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path
            fillRule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v4a1 1 0 001 1h2a1 1 0 100-2h-1V7z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <p className="text-gray-600">
        Dernière connexion :{" "}
        <span className="font-semibold">{new Date().toLocaleString()}</span>
      </p>
    </li>
    <li className="flex items-center space-x-4 bg-gray-100 p-4 rounded-lg shadow">
      <div className="bg-green-100 text-green-500 p-2 rounded-full">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13.707 3.293a1 1 0 010 1.414L9.414 9l4.293 4.293a1 1 0 01-1.414 1.414l-5-5a1 1 0 010-1.414l5-5a1 1 0 011.414 0z" />
        </svg>
      </div>
      <p className="text-gray-600">
        Dernière modification du profil :{" "}
        <span className="font-semibold">01/11/2024</span>
      </p>
    </li>
  </ul>
</div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
