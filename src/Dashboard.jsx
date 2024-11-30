import React, { useEffect, useState } from "react";
import { onSnapshot, collection, doc, deleteDoc, addDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { db } from "./config/firebase";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [expandedTaskId, setExpandedTaskId] = useState(null); // Nouvel état
  const [filters, setFilters] = useState({
    priorite: "",
    status: "",
    assignedTo: "",
    keyword: "",
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), async (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const completedTasks = tasksData.filter((task) => task.status === "Terminé");
      for (const task of completedTasks) {
        await addDoc(collection(db, "history"), task);
        const taskDoc = doc(db, "tasks", task.id);
        await deleteDoc(taskDoc);
      }

      const remainingTasks = tasksData.filter((task) => task.status !== "Terminé");
      setTasks(remainingTasks);
      setFilteredTasks(remainingTasks);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (filters.priorite) {
      filtered = filtered.filter((task) => task.priorite === filters.priorite);
    }

    if (filters.status) {
      filtered = filtered.filter((task) => task.status === filters.status);
    }

    if (filters.assignedTo) {
      filtered = filtered.filter((task) =>
        task.assignedTo.toLowerCase().includes(filters.assignedTo.toLowerCase())
      );
    }

    if (filters.keyword) {
      filtered = filtered.filter(
        (task) =>
          task.title.toLowerCase().includes(filters.keyword.toLowerCase()) ||
          task.description?.toLowerCase().includes(filters.keyword.toLowerCase())
      );
    }

    setFilteredTasks(filtered);
  }, [filters, tasks]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="flex flex-col h-screen bg-gradient-to-r from-gray-200 via-gray-300 to-gray-400">
      <div className="flex flex-grow">
        <div className="w-1/3 bg-gray-50 p-8 text-black flex flex-col items-center justify-center shadow-lg">
          <h1 className="text-4xl font-extrabold mb-6">Espace Utilisateur</h1>
          <p className="text-lg text-center leading-relaxed">
            Consultez toutes les tâches disponibles ici. <br />
            Visualisez leur statut, les commentaires, et les fichiers joints.
          </p>
          <div className="mt-6">
            <dotlottie-player
              src="https://lottie.host/03704ac6-2fc5-439b-8ec0-6ff2fee69082/ljqCSWGIT1.lottie"
              background="transparent"
              speed="1"
              style={{ width: "300px", height: "300px" }}
              loop
              autoplay
            ></dotlottie-player>
          </div>
        </div>
        <div className="w-2/3 p-8 overflow-y-auto">
          <motion.h1
            className="text-3xl font-bold text-gray-800 mb-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            Liste des Tâches
          </motion.h1>

          <motion.div
            className="mb-6 grid grid-cols-4 gap-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <select
              name="priorite"
              value={filters.priorite}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
            >
              <option value="">Toutes les priorités</option>
              <option value="high">Haute</option>
              <option value="medium">Moyenne</option>
              <option value="low">Basse</option>
            </select>
            <select
              name="status"
              value={filters.status}
              onChange={handleFilterChange}
              className="p-2 border rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
            >
              <option value="">Tous les statuts</option>
              <option value="Commencer">Commencer</option>
              <option value="En cours">En cours</option>
            </select>
            <input
              type="text"
              name="assignedTo"
              value={filters.assignedTo}
              onChange={handleFilterChange}
              placeholder="Responsable"
              className="p-2 border rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
            />
            <input
              type="text"
              name="keyword"
              value={filters.keyword}
              onChange={handleFilterChange}
              placeholder="Rechercher par mots-clés"
              className="p-2 border rounded-lg bg-white shadow-md hover:shadow-lg transition-all"
            />
          </motion.div>

          <motion.div
            className="grid grid-cols-2 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            {filteredTasks.map((task) => (
              <motion.div
                key={task.id}
                className="p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 border-t-4"
                style={{
                  borderColor:
                    task.status === "En cours" ? "#eab308" : "#ef4444",
                }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="font-semibold text-lg text-gray-800 mb-2">
                  {task.title}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">{task.description}</p>
                <p className="text-gray-500 text-sm">
                  <strong>Priorité :</strong> {task.priorite}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Assigné à :</strong> {task.assignedTo}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Soumis par :</strong> {task.submittedBy}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Statut :</strong> {task.status || "Commencer"}
                </p>
                <p className="text-gray-500 text-sm">
                  <strong>Date de soumission :</strong>{" "}
                  {task.createdAt
                    ? task.createdAt.toDate
                      ? task.createdAt.toDate().toLocaleString()
                      : new Date(task.createdAt).toLocaleString()
                    : "Non disponible"}
                </p>
                <div className="mt-2">
                  <strong>Commentaires :</strong>
                  <ul className="mt-1 text-sm text-gray-600">
                    {task.comments?.map((comment, index) => (
                      <li key={index}>
                        <span className="font-semibold">{comment.author}:</span>{" "}
                        {comment.text}
                      </li>
                    ))}
                  </ul>
                </div>
                {task.chatGptResponse && (
  <div className="mt-4 p-3 bg-blue-100 rounded-lg">
    {/* Ajout du sous-titre */}
    <h4 className="text-lg font-semibold text-blue-600 mb-2">
      Plan généré par ChatGPT
    </h4>
    <button
      onClick={() =>
        setExpandedTaskId(
          expandedTaskId === task.id ? null : task.id
        )
      }
      className="text-blue-600 hover:underline"
    >
      {expandedTaskId === task.id
        ? "Masquer le plan"
        : "Afficher le plan"}
    </button>
    {expandedTaskId === task.id && (
      <p className="mt-1 text-gray-700">
        {task.chatGptResponse}
      </p>
    )}
  </div>
)}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
