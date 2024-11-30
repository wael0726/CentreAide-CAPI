import { useState } from 'react';
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    signInWithEmailAndPassword,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import imgbg from './assets/imgbg.webp';
import collLogo from './assets/coll.png'; // Assurez-vous que le logo est dans ce chemin

const Login = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleGoogleLogin = async () => {
        setAuthing(true);
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            alert(`Welcome, ${user.displayName}!`);
            navigate('/task-form');
        } catch (error) {
            console.error("Google login error:", error.message);
            setError(error.message);
        } finally {
            setAuthing(false);
        }
    };

    const handleFacebookLogin = async () => {
        setAuthing(true);
        const provider = new FacebookAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            alert(`Welcome, ${user.displayName}!`);
            navigate('/task-form');
        } catch (error) {
            console.error("Facebook login error:", error.message);
            setError(error.message);
        } finally {
            setAuthing(false);
        }
    };

    const handleEmailLogin = async () => {
        setAuthing(true);
        setError('');
        try {
            const result = await signInWithEmailAndPassword(auth, email, password);
            const user = result.user;
            alert(`Welcome back, ${user.email}!`);
            navigate('/task-form');
        } catch (error) {
            console.error("Email login error:", error.message);
            setError(error.message);
        } finally {
            setAuthing(false);
        }
    };

    return (
        <div className='w-full h-screen flex'>
            {/* Left half of the screen */}
            <div
                className="w-1/2 h-full relative"
                style={{
                    backgroundImage: `url(${imgbg})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                }}
            >
                {/* Black transparent rectangle */}
                <div className="absolute bottom-0 w-full h-1/4 bg-black bg-opacity-75 flex items-center justify-between px-10">
                    {/* Logo à gauche */}
                    <img src={collLogo} alt="Collège Maisonneuve Logo" className="w-80 h-30 h-auto" />
                    
                    {/* Message de bienvenue à droite */}
                    <h3 className="text-gray-50 text-xl text-center">
                    Veuillez vous connecter pour accéder à votre espace utilisateur.
                    </h3>
                </div>
            </div>

            {/* Right half of the screen */}
            <div className='w-1/2 h-full bg-white flex flex-col p-20 justify-center'>
                <div className='w-full flex flex-col max-w-[450px] mx-auto'>
                    <div className='w-full flex flex-col mb-10'>
                        <h3 className='text-5xl font-bold mb-2 text-blue-600'>Connexion</h3>
                        <p className='text-lg mb-4 text-gray-600'>Bienvenue ! Veuillez entrer vos informations ci-dessous.</p>
                    </div>

                    <div className='w-full flex flex-col mb-6'>
                        <input
                            type='email'
                            placeholder='Email'
                            className='w-full py-3 px-4 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <input
                            type='password'
                            placeholder='Mot de passe'
                            className='w-full py-3 px-4 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <div className='w-full flex flex-col mb-4'>
                        <button
                            className='w-full bg-blue-600 text-white font-semibold rounded-md p-4 text-center cursor-pointer hover:bg-blue-700 transition-all'
                            onClick={handleEmailLogin}
                            disabled={authing}>
                            Se connecter
                        </button>
                    </div>

                    {error && <div className='text-red-500 mb-4'>{error}</div>}

                    <div className='w-full flex items-center justify-center relative py-4'>
                        <div className='w-full h-[1px] bg-gray-300'></div>
                        <p className='text-lg absolute text-gray-600 bg-white px-2'>OU</p>
                    </div>

                    <button
                        className='w-full bg-gray-100 text-black font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all mt-7'
                        onClick={handleGoogleLogin}
                        disabled={authing}>
                        Se connecter avec Google
                    </button>

                    <button
                        className='w-full bg-blue-500 text-white font-semibold rounded-md p-4 text-center flex items-center justify-center cursor-pointer hover:bg-blue-600 transition-all mt-4'
                        onClick={handleFacebookLogin}
                        disabled={authing}>
                        Se connecter avec Facebook
                    </button>
                </div>

                <div className='w-full flex items-center justify-center mt-10'>
                    <p className='text-sm font-normal text-gray-600'>
                        Vous n'avez pas de compte ?{' '}
                        <span className='font-semibold text-blue-600 cursor-pointer underline'>
                            <a href='/signup'>Créer un compte</a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;
