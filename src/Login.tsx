import {
	GoogleAuthProvider,
	signInAnonymously,
	signInWithPopup,
	updateProfile,
	type UserCredential,
} from "firebase/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "./context/AuthContext";
import { auth, db } from "./firebase";

const Login = () => {
	const { user, loading } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (!loading && user) {
			navigate("/app");
		}
	}, [user, loading, navigate]);

	const handleGoogleLogin = async () => {
		const provider = new GoogleAuthProvider();
		try {
			const res: UserCredential = await signInWithPopup(auth, provider);
			await setDoc(doc(db, "users", res.user.uid), {
				uid: res.user.uid,
				name: res.user.displayName,
				photoURL: res.user.photoURL,
				authProvider: "google",
				status: "online",
				lastSeen: serverTimestamp(),
			});
			// On successful login, the onAuthStateChanged listener in AuthContext
			// will handle the user state update, and the useEffect hook above
			// will trigger the navigation.
		} catch (error: any) {
			// Handle Errors here.
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error("Google sign-in error:", {
				errorCode,
				errorMessage,
			});
		}
	};

	const handleAnonymousLogin = async () => {
		try {
			const generatedNum = Math.floor(Math.random() * 100) + 1;
			const displayName = `Guest-${Math.random().toString(36).substring(2, 7)}`;
			const photoURL = `https://avatar.iran.liara.run/public/${generatedNum}`;

			const res: UserCredential = await signInAnonymously(auth);

			// Update the user's auth profile so display name and photo are available globally
			await updateProfile(res.user, {
				displayName,
				photoURL,
			});

			// Store user information in Firestore. This is good for having a 'users'
			// collection you can query or enrich with more data later.
			await setDoc(doc(db, "users", res.user.uid), {
				uid: res.user.uid,
				name: displayName,
				photoURL: photoURL,
				authProvider: "anonymous",
				status: "online",
				lastSeen: serverTimestamp(),
			});

			// On successful login, the onAuthStateChanged listener in AuthContext
			// will handle the user state update, and the useEffect hook above
			// will trigger the navigation.
		} catch (error: any) {
			const errorCode = error.code;
			const errorMessage = error.message;
			console.error("Anonymous sign-in error:", {
				errorCode,
				errorMessage,
			});
		}
	};
	if (loading) {
		return (
			<div className='relative flex h-screen w-screen items-center justify-center'>
				<img
					src='/bg.png'
					alt='background'
					className='h-full w-full object-cover'
				/>
				<div className='absolute flex h-full w-full items-center justify-center bg-black/50'>
					{/* A modern loading spinner */}
					<div className='h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-400 border-t-transparent'></div>
				</div>
			</div>
		);
	}
	return (
		<div className='relative flex h-screen w-screen items-center  justify-center'>
			<img
				src='/bg.png'
				alt='background'
				className='h-full w-full object-cover'
			/>
			<div className='absolute flex h-screen w-screen items-center justify-center p-4'>
				<div className='w-full max-w-md rounded-2xl border border-white/20 bg-black/30 p-8 text-white shadow-2xl backdrop-blur-lg md:p-12'>
					<div className='text-center'>
						<svg
							xmlns='http://www.w3.org/2000/svg'
							className='mx-auto h-16 w-16 text-blue-400'
							fill='none'
							viewBox='0 0 24 24'
							stroke='currentColor'
							strokeWidth={1.5}>
							<path
								strokeLinecap='round'
								strokeLinejoin='round'
								d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
							/>
						</svg>
						<h1 className='mt-6 text-3xl font-bold'>Welcome to Chat App!</h1>
						<p className='mt-4 text-lg text-white/60'>
							Sign in to connect with others in real-time.
						</p>
					</div>
					<div className='mt-10 w-full space-y-4'>
						<button
							onClick={handleGoogleLogin}
							className='group flex w-full items-center justify-center gap-3 rounded-lg bg-blue-600 py-3 px-4 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-black/20'>
							<div className='flex h-6 w-6 items-center justify-center rounded-full bg-white p-1 transition-transform duration-300 group-hover:scale-110'>
								<img
									src='https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg'
									alt='Google icon'
								/>
							</div>
							Sign in with Google
						</button>

						<button
							onClick={handleAnonymousLogin}
							className='group flex w-full items-center justify-center gap-3 rounded-lg border border-white/30 bg-transparent py-3 px-4 font-semibold text-white transition-colors duration-300 ease-in-out hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/50 focus:ring-offset-2 focus:ring-offset-black/20'>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='h-6 w-6 text-white/80 transition-transform duration-300 group-hover:scale-110'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
								strokeWidth={1.5}>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									d='M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z'
								/>
							</svg>
							Continue as a Guest
						</button>
					</div>
					<p className='mt-8 text-center text-xs text-white/50'>
						By continuing, you agree to our imaginary Terms of Service.
					</p>
				</div>
			</div>
		</div>
	);
};

export default Login;
