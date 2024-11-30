import { initializeApp } from "firebase/app";
import { createUserWithEmailAndPassword, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, setDoc, doc, collection, query, where, getDocs } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { toast } from "react-toastify";

const firebaseConfig = {
    apiKey: "AIzaSyBmnAgNW6aSpY_1wFMTFhx9hQRpe1-5YI0",
    authDomain: "misession-820ab.firebaseapp.com",
    projectId: "misession-820ab",
    storageBucket: "misession-820ab.appspot.com",
    messagingSenderId: "18832346524",
    appId: "1:18832346524:web:2783e5d54197e14a33cc59"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

const signup = async (username, email, password) => {
    try{
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        await setDoc(doc(db,"users", user.uid),{
            id:user.uid,
            username:username.toLowerCase(),
            email,
            name:"",
            avatar:"",
            bio:"Hey its me",
            lastSeen:Date.now()
        })
        
        await setDoc(doc(db, "chats", user.uid), {
            chatsData:[]
        })
    } catch (error) {
        console.error(error)
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
}

const login = async (email, password) => {
    try{
        await signInWithEmailAndPassword(auth, email, password)
    } catch(error) {
        console.error(error)
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
}

const logout = async () => {
    try{
        await signOut(auth)
    } catch(error){
        console.error(error)
        toast.error(error.code.split("/")[1].split("-").join(" "));
    }
}

const resetPass = async (email) => {
    if (!email) {
        toast.error("Enter your email");
        return null;
    }
    try {
        const userRef = collection(db, "users");
        const q = query(userRef, where("email", "==", email))
        const querySnap = await getDocs(q);
        if (!querySnap.empty) {
            await sendPasswordResetEmail(auth, email);
            toast.success("Reset email sent")
        }
        else {
            toast.error("Email does not exist")
        }
    } catch (error) {
        console.error(error);
        toast.error(error.message)
    }
}

export {signup, login, logout, resetPass, auth, db, storage};