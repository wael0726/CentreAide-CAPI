import { useState } from 'react';
import {
    getAuth,
    GoogleAuthProvider,
    FacebookAuthProvider,
    signInWithPopup,
    createUserWithEmailAndPassword,
    sendEmailVerification,
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import imgbg from './assets/imgbg.webp';
import collLogo from './assets/coll.png';
import ReCAPTCHA from "react-google-recaptcha";

const Signup = () => {
    const auth = getAuth();
    const navigate = useNavigate();

    const [authing, setAuthing] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [captchaVerified, setCaptchaVerified] = useState(false);

    const handleCaptcha = (value) => {
        if (value) {
            setCaptchaVerified(true);
            setError('');
        } else {
            setCaptchaVerified(false);
            setError('Veuillez compléter le ReCAPTCHA.');
        }
    };

    const signUpWithGoogle = async () => {
        if (!captchaVerified) {
            setError('Veuillez compléter le ReCAPTCHA.');
            return;
        }

        setAuthing(true);
        try {
            const result = await signInWithPopup(auth, new GoogleAuthProvider());
            alert(`Bienvenue, ${result.user.displayName} !`);
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setAuthing(false);
        }
    };

    const signUpWithFacebook = async () => {
        if (!captchaVerified) {
            setError('Veuillez compléter le ReCAPTCHA.');
            return;
        }

        setAuthing(true);
        try {
            const result = await signInWithPopup(auth, new FacebookAuthProvider());
            alert(`Bienvenue, ${result.user.displayName} !`);
            navigate('/');
        } catch (error) {
            setError(error.message);
        } finally {
            setAuthing(false);
        }
    };

    const signUpWithEmail = async () => {
        if (!captchaVerified) {
            setError('Veuillez compléter le ReCAPTCHA.');
            return;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas.');
            return;
        }

        setAuthing(true);
        try {
            const result = await createUserWithEmailAndPassword(auth, email, password);
            await sendEmailVerification(result.user);
            alert('Un email de vérification a été envoyé. Veuillez vérifier votre boîte mail.');
            navigate('/login');
        } catch (error) {
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
                <div className="absolute bottom-0 w-full h-1/4 bg-black bg-opacity-75 flex items-center px-10">
                    {/* Logo à gauche */}
                    <img src={collLogo} alt="Collège Maisonneuve Logo" className="w-80 h-auto" />

                    {/* Message explicatif */}
                    <div className="ml-6">
                        <h3 className="text-white text-2xl font-bold">Inscription requise</h3>
                        <p className="text-white text-lg mt-2">
                            Créez un compte pour accéder à votre espace étudiant et gérer vos tâches.
                        </p>
                    </div>
                </div>
            </div>

            {/* Right half of the screen */}
            <div className='w-1/2 h-full bg-white flex flex-col p-20 justify-center'>
                <div className='w-full flex flex-col max-w-[450px] mx-auto'>
                    <div className='w-full flex flex-col mb-10'>
                        <h3 className='text-5xl font-bold mb-2 text-blue-600'>Inscription</h3>
                        <p className='text-lg mb-4 text-gray-600'>Bienvenue ! Veuillez remplir les informations ci-dessous.</p>
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
                        <input
                            type='password'
                            placeholder='Confirmez le mot de passe'
                            className='w-full py-3 px-4 mb-4 bg-gray-100 border border-gray-300 rounded-md focus:outline-none focus:border-blue-600'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>

                    {error && <div className='text-red-500 mb-4'>{error}</div>}

                    <div className='w-full flex flex-col mb-4'>
                        <button
                            onClick={signUpWithEmail}
                            disabled={authing || !captchaVerified}
                            className={`w-full ${
                                captchaVerified
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                            } font-semibold rounded-md p-4 text-center`}>
                            S'inscrire
                        </button>
                    </div>

                    <div className='w-full flex items-center justify-center relative py-4'>
                        <div className='w-full h-[1px] bg-gray-300'></div>
                        <p className='text-lg absolute text-gray-600 bg-white px-2'>OU</p>
                    </div>

                    <button
                        onClick={signUpWithGoogle}
                        disabled={authing || !captchaVerified}
                        className={`w-full ${
                            captchaVerified
                                ? 'bg-gray-100 text-black'
                                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        } font-semibold rounded-md p-4 text-center mt-7`}>
                        S'inscrire avec Google
                    </button>

                    <button
                        onClick={signUpWithFacebook}
                        disabled={authing || !captchaVerified}
                        className={`w-full ${
                            captchaVerified
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-500 text-gray-300 cursor-not-allowed'
                        } font-semibold rounded-md p-4 text-center mt-4`}>
                        S'inscrire avec Facebook
                    </button>
                </div>

                <div className='w-full flex flex-col items-center mt-6'>
                    <ReCAPTCHA sitekey="6LcaUncqAAAAAPPda7l8UKdkZgIHtTJ3yAicMQeB" onChange={handleCaptcha} />
                </div>

                <div className='w-full flex items-center justify-center mt-10'>
                    <p className='text-sm font-normal text-gray-600'>
                        Vous avez déjà un compte ?{' '}
                        <span className='font-semibold text-blue-600 cursor-pointer underline'>
                            <a href='/login'>Connectez-vous</a>
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;
