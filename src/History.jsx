import React, { useEffect, useState } from "react";
import { onSnapshot, collection } from "firebase/firestore";
import { db } from "./config/firebase";

const History = () => {
  const [historyTasks, setHistoryTasks] = useState([]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "history"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setHistoryTasks(tasksData);
    });

    return () => unsubscribe(); // Nettoyage de l'écoute
  }, []);

  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
        Historique des Tâches
      </h1>
      <div className="grid grid-cols-2 gap-6">
        {historyTasks.map((task) => (
          <div
            key={task.id}
            className="p-6 bg-white rounded-xl shadow-md border-t-4 border-green-500 flex flex-col items-center"
          >
            <lord-icon
              src="https://cdn.lordicon.com/lomfljuq.json"
              trigger="hover"
              style={{ width: "100px", height: "100px", marginBottom: "10px" }}
            ></lord-icon>
            <h3 className="font-bold text-lg text-gray-800">{task.title}</h3>
            <p className="text-gray-600 mt-2 text-center">{task.description}</p>
            <p className="text-sm text-gray-500 mt-2">
              Assigné à : <span className="font-bold">{task.assignedTo}</span>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default History;
