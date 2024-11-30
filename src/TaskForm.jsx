import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { motion } from "framer-motion";
import OpenAI from "openai"
import { key } from "./chatgpt"
import { db, auth, storage } from "./config/firebase";

const TaskForm = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [priorite, setPriorite] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [submittedBy, setSubmittedBy] = useState("");
  const [newComment, setNewComment] = useState("");
  const [newAssignee, setNewAssignee] = useState("");

  const openai = new OpenAI({apiKey: key, dangerouslyAllowBrowser: true});

  const handleAddTask = async (e) => {
    e.preventDefault();
  
    if (title && description && priorite) {
      try {
        // Si un fichier est joint, téléchargez-le
        const fileUrl = file ? await uploadFile(file) : null;
  
        // Appel à ChatGPT pour générer le plan
        const completion = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Fais un plan d'une heure pour aider les élèves dans l'apprentissage informatique.",
            },
            {
              role: "user",
              content: description,
            },
          ],
        });
  
        console.log("ChatGPT retourne :", completion.choices[0].message);
  
        // Récupération du contenu généré par ChatGPT
        const gptPlan = completion.choices[0].message.content;
  
        // Ajout de la tâche dans Firestore
        await addDoc(collection(db, "tasks"), {
          title,
          description,
          priorite,
          status: "Commencer",
          comments: [], // Champ pour les commentaires
          assignedTo: "admin@example.com", // Assignation par défaut
          submittedBy, // Utilisateur connecté
          createdAt: new Date(),
          fileUrl, // URL du fichier téléchargé
          chatGptResponse: gptPlan, // Plan généré par ChatGPT
        });
  
        console.log("Tâche ajoutée avec succès avec le plan ChatGPT !");
        setTitle("");
        setDescription("");
        setPriorite("");
        setFile(null);
        toast.success("Tâche ajoutée avec succès !");
      } catch (error) {
        console.error("Erreur lors de l'ajout de la tâche :", error);
        toast.error("Erreur lors de l'ajout de la tâche.");
      }
    } else {
      toast.warn("Veuillez remplir tous les champs.");
    }
  };
  // Liste des administrateurs autorisés
  const admins = ["wmbennabi05@gmail.com", "dany123@gmail.com"];

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setSubmittedBy(user.email);
        if (!admins.includes(user.email)) {
          alert("You are not authorized to access this page.");
          navigate("/dashboard");
        }
      } else {
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tasks"), (snapshot) => {
      const tasksData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasksData);
    });
    return () => unsubscribe();
  }, []);

  const sendEmailNotification = async (recipient, subject, message) => {
    try {
      await fetch("/sendEmail", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipient, subject, message }),
      });
      toast.success("Notification envoyée !");
    } catch (error) {
      console.error("Erreur lors de l'envoi de l'email :", error);
      toast.error("Erreur lors de l'envoi de la notification.");
    }
  };

  const handleChangeStatus = async (taskId, newStatus) => {
    const taskDoc = doc(db, "tasks", taskId);
    const task = tasks.find((task) => task.id === taskId);

    try {
      await updateDoc(taskDoc, { status: newStatus });
      toast.info(`Statut de la tâche mis à jour à "${newStatus}"`);
      sendEmailNotification(
        task.assignedTo,
        "Mise à jour de la tâche",
        `Le statut de la tâche "${task.title}" a été mis à jour à "${newStatus}".`
      );
    } catch (error) {
      console.error("Error updating task status:", error);
      toast.error("Erreur lors de la mise à jour du statut.");
    }
  };

  const handleReassignTask = async (taskId, newAssignee) => {
    const taskDoc = doc(db, "tasks", taskId);
    const task = tasks.find((task) => task.id === taskId);

    try {
      await updateDoc(taskDoc, { assignedTo: newAssignee });
      toast.info("Tâche réassignée avec succès !");
      sendEmailNotification(
        newAssignee,
        "Nouvelle tâche assignée",
        `Une nouvelle tâche intitulée "${task.title}" vous a été assignée.`
      );
    } catch (error) {
      console.error("Error reassigning task:", error);
      toast.error("Erreur lors de la réassignation.");
    }
  };

  const uploadFile = (file) => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storage, `tasks/${file.name}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      uploadTask.on(
        "state_changed",
        null,
        (error) => reject(error),
        async () => {
          const fileUrl = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(fileUrl);
        }
      );
    });
  };

  const handleAddComment = async (taskId) => {
    const taskDoc = doc(db, "tasks", taskId);
    const task = tasks.find((task) => task.id === taskId);
    const updatedComments = [
      ...(task.comments || []),
      { author: submittedBy, text: newComment },
    ];

    try {
      await updateDoc(taskDoc, { comments: updatedComments });
      setNewComment("");
      alert("Comment added successfully!");
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const handleEditTask = async (taskId, updatedTask) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      await updateDoc(taskDoc, updatedTask);
      alert("Task updated successfully!");
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      const taskDoc = doc(db, "tasks", taskId);
      await deleteDoc(taskDoc);
      alert("Task deleted successfully!");
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };
  

  return (
    <div className="flex h-screen bg-gradient-to-r from-gray-100 via-white to-gray-50">
      {/* Left Section */}
      <div className="relative w-1/3 bg-gradient-to-br from-purple-700 to-indigo-800 text-white p-8 flex flex-col justify-center items-center shadow-xl">
        <h1 className="text-4xl font-bold mb-4">Créer une Tâche</h1>
        <p className="text-center text-lg mb-6">
          Ajoutez une nouvelle tâche avec son titre, description et priorité.
          Vous pouvez aussi joindre un fichier si nécessaire.
        </p>
        <form
          onSubmit={handleAddTask}
          className="space-y-4 w-full max-w-md flex flex-col"
        >
          <input
            type="text"
            placeholder="Titre"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="p-3 rounded-lg w-full bg-gray-200 text-gray-800 placeholder-gray-400"
            required
          />
          <textarea
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="p-3 rounded-lg w-full bg-gray-200 text-gray-800 placeholder-gray-400"
            required
          />
          <select
            value={priorite}
            onChange={(e) => setPriorite(e.target.value)}
            className="p-3 rounded-lg w-full bg-gray-200 text-gray-800"
            required
          >
            <option value="">Priorité</option>
            <option value="low">Basse</option>
            <option value="medium">Moyenne</option>
            <option value="high">Élevée</option>
          </select>
          <input
            type="file"
            onChange={(e) => setFile(e.target.files[0])}
            className="p-3 rounded-lg w-full bg-gray-200 text-gray-800"
          />
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white p-3 rounded-lg font-semibold"
          >
            Ajouter
          </button>
        </form>
      </div>

      {/* Right Section */}
      <div className="w-2/3 p-10 overflow-y-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          Toutes les Tâches
        </h1>
        <div className="grid grid-cols-2 gap-6">
          {tasks.map((task) => (
            <motion.div
              key={task.id}
              className="p-6 bg-white rounded-lg shadow-lg hover:shadow-xl transition-all border-t-4"
              style={{
                borderColor:
                  task.status === "Terminé"
                    ? "#16a34a"
                    : task.status === "En cours"
                    ? "#facc15"
                    : "#dc2626",
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <h3 className="font-bold text-lg text-gray-700">{task.title}</h3>
              <p>{task.description}</p>
              <p className="text-gray-500 text-sm">Priority: {task.priorite}</p>
              <p className="text-gray-500 text-sm">Assigned to: {task.assignedTo}</p>
              <p className="text-gray-500 text-sm">Submitted by: {task.submittedBy}</p>
              <p className="text-gray-500 text-sm">
                Status: <span className="font-bold">{task.status || "Commencer"}</span>
              </p>
              <p className="text-gray-500 text-sm">
  Date de soumission:{" "}
  {task.createdAt
    ? (task.createdAt.toDate ? task.createdAt.toDate() : new Date(task.createdAt)).toLocaleString()
    : "Non disponible"}
</p>
              {task.fileUrl && (
                <div className="mt-4">
                  <a
                    href={task.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    Voir la pièce jointe
                  </a>
                </div>
              )}
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() => handleChangeStatus(task.id, "Commencer")}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Commencer
                </button>
                <button
                  onClick={() => handleChangeStatus(task.id, "En cours")}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  En cours
                </button>
                <button
                  onClick={() => handleChangeStatus(task.id, "Terminé")}
                  className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm"
                >
                  Terminé
                </button>
              </div>
              <div className="mt-4 flex gap-3">
                <button
                  onClick={() =>
                    handleEditTask(task.id, {
                      title:
                        prompt("Modifier le titre", task.title) || task.title,
                      description:
                        prompt("Modifier la description", task.description) ||
                        task.description,
                      priorite:
                        prompt("Modifier la priorité", task.priorite) ||
                        task.priorite,
                    })
                  }
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg w-1/2"
                >
                  Modifier
                </button>
                <button
                  onClick={() => handleDeleteTask(task.id)}
                  className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg w-1/2"
                >
                  Supprimer
                </button>
              </div>
              <textarea
                placeholder="Ajouter un commentaire"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="w-full p-2 border rounded-md mt-4 text-sm"
              />
              <button
                onClick={() => handleAddComment(task.id)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white p-2 text-sm rounded-lg mt-2"
              >
                Ajouter un commentaire
              </button>
              <input
                type="text"
                placeholder="Réassigner à"
                value={newAssignee}
                onChange={(e) => setNewAssignee(e.target.value)}
                className="w-full p-2 border rounded-md mt-2 text-sm"
              />
              <button
                onClick={() => handleReassignTask(task.id, newAssignee)}
                className="w-full bg-gray-800 hover:bg-gray-700 text-white p-2 text-sm rounded-lg mt-2"
              >
                Réassigner
              </button>
              <div className="mt-4">
                <h4 className="font-semibold text-gray-700">Commentaires :</h4>
                {task.comments?.map((comment, index) => (
                  <p key={index} className="text-sm text-gray-600 mt-1">
                    <span className="font-semibold">{comment.author} :</span> {comment.text}
                  </p>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskForm;
