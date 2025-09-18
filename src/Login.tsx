import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	updateProfile,
} from "firebase/auth";
import { useState } from "react";
import { doc, serverTimestamp, setDoc } from "firebase/firestore";
import { useAuth } from "./context/AuthContext";
import { toast } from "react-toastify";
import { auth, db } from "./firebase";
import { FaEyeSlash } from "react-icons/fa";
import { FaEye } from "react-icons/fa";

const getFriendlyErrorMessage = (errorCode: string): string => {
	switch (errorCode) {
		case "auth/email-already-in-use":
			return "This email address is already in use by another account.";
		case "auth/invalid-email":
			return "The email address is not valid. Please enter a valid email.";
		case "auth/operation-not-allowed":
			return "This sign-in method is not enabled. Please contact support.";
		case "auth/weak-password":
			return "The password is too weak. It must be at least 6 characters long.";
		case "auth/user-not-found":
			return "No account found with this email address.";
		case "auth/wrong-password":
			return "Incorrect password. Please check your password and try again.";
		case "auth/user-disabled":
			return "This user account has been disabled.";
		case "auth/too-many-requests":
			return "Access to this account has been temporarily disabled due to many failed login attempts. You can try again later.";
		default:
			return "An unexpected error occurred. Please try again.";
	}
};

const calculatePasswordStrength = (password: string): number => {
	if (!password) return 0;

	let score = 0;
	// Score is capped at 4 to match the indicator bars.
	// 1 point for length >= 8
	if (password.length >= 8) score++;
	// 1 point for having both lowercase and uppercase letters
	if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
	// 1 point for having numbers
	if (/[0-9]/.test(password)) score++;
	// 1 point for having special characters
	if (/[^A-Za-z0-9]/.test(password)) score++;

	return score;
};

const PasswordStrengthIndicator = ({ score }: { score: number }) => {
	const levels = [
		{ label: "Weak", color: "bg-red-500", textColor: "text-red-400" },
		{ label: "Medium", color: "bg-orange-500", textColor: "text-orange-400" },
		{ label: "Good", color: "bg-yellow-500", textColor: "text-yellow-400" },
		{ label: "Strong", color: "bg-green-500", textColor: "text-green-400" },
	];

	const currentLevel = score > 0 ? levels[score - 1] : null;

	return (
		<div className='mt-2 space-y-1'>
			<div className='flex w-full gap-x-1'>
				{Array.from({ length: 4 }).map((_, index) => (
					<div
						key={index}
						className={`h-1.5 flex-1 rounded-full transition-colors duration-300 ${
							score > index ? levels[index].color : "bg-white/20"
						}`}
					/>
				))}
			</div>
			{currentLevel && (
				<p className={`text-xs font-medium ${currentLevel.textColor}`}>
					{currentLevel.label}
				</p>
			)}
		</div>
	);
};

const Login = () => {
	const { loading } = useAuth();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [username, setUsername] = useState(""); // For registration
	const [isRegistering, setIsRegistering] = useState(false); // To toggle form
	const [confirmPassword, setConfirmPassword] = useState(""); // For registration
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [passwordStrength, setPasswordStrength] = useState(0);
	const [showPassword, setShowPassword] = useState(false);

	// State for instant validation errors
	const [fieldErrors, setFieldErrors] = useState({
		username: "",
		email: "",
		password: "",
		confirmPassword: "",
	});

	const validateField = (name: string, value: string): string => {
		let error = "";
		switch (name) {
			case "username":
				if (isRegistering && !value) error = "Username is required.";
				else if (isRegistering && value.length < 3)
					error = "Username must be at least 3 characters.";
				break;
			case "email":
				if (!value) error = "Email is required.";
				else if (!/\S+@\S+\.\S+/.test(value))
					error = "Please enter a valid email address.";
				break;
			case "password":
				if (!value) error = "Password is required.";
				else if (value.length < 6)
					error = "Password must be at least 6 characters long.";
				break;
			case "confirmPassword":
				if (isRegistering && !value) error = "Please confirm your password.";
				else if (isRegistering && value !== password)
					error = "Passwords do not match.";
				break;
			default:
				break;
		}
		setFieldErrors((prev) => ({ ...prev, [name]: error }));
		return error;
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		validateField(name, value);
	};

	const handleAuthAction = async (e: React.FormEvent) => {
		e.preventDefault();

		// Run all validations on submit
		const usernameValid = !validateField("username", username);
		const emailValid = !validateField("email", email);
		const passwordValid = !validateField("password", password);
		const confirmPasswordValid = !validateField(
			"confirmPassword",
			confirmPassword
		);

		if (
			!(isRegistering
				? usernameValid && emailValid && passwordValid && confirmPasswordValid
				: emailValid && passwordValid)
		) {
			return;
		}

		setIsSubmitting(true);
		if (isRegistering) {
			try {
				const res = await createUserWithEmailAndPassword(auth, email, password);
				const displayName = username;
				const generatedNumber = Math.floor(Math.random() * 100) + 1; // Generate a random number between 1 and 100
				const photoURL = `https://avatar.iran.liara.run/public/${generatedNumber}`;

				// Update the user's auth profile
				await updateProfile(res.user, {
					displayName,
					photoURL,
				});

				// Store user information in Firestore
				await setDoc(doc(db, "users", res.user.uid), {
					uid: res.user.uid,
					name: displayName,
					photoURL: photoURL,
					authProvider: "email",
					status: "online",
					lastSeen: serverTimestamp(),
				});
				toast.success("Registration successful! Welcome.");
				// Navigation is handled by the useEffect hook
			} catch (err: any) {
				toast.error(getFriendlyErrorMessage(err.code));
				console.error("Email/Password registration error:", err);
			} finally {
				setIsSubmitting(false);
			}
		} else {
			// Sign-in logic
			try {
				await signInWithEmailAndPassword(auth, email, password);
				// Navigation is handled by the useEffect hook
			} catch (err: any) {
				toast.error(getFriendlyErrorMessage(err.code));
				console.error("Email/Password sign-in error:", err);
			} finally {
				setIsSubmitting(false);
			}
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
					<div className='mt-10 w-full'>
						<form
							onSubmit={handleAuthAction}
							className='space-y-5'
							noValidate>
							{isRegistering && (
								<div>
									<input
										id='username'
										name='username'
										type='text'
										placeholder='Username'
										value={username}
										onChange={(e) => setUsername(e.target.value)}
										onBlur={handleBlur}
										className={`w-full rounded-lg border bg-black/20 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-1 ${
											fieldErrors.username
												? "border-red-400 focus:border-red-400 focus:ring-red-400"
												: "border-white/20 focus:border-blue-400 focus:ring-blue-400"
										}`}
										required
										aria-invalid={!!fieldErrors.username}
										aria-describedby='username-error'
									/>
									{fieldErrors.username && (
										<p
											id='username-error'
											className='mt-1 text-xs text-red-400'>
											{fieldErrors.username}
										</p>
									)}
								</div>
							)}
							<div>
								<input
									id='email'
									name='email'
									type='email'
									placeholder='Email'
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									onBlur={handleBlur}
									className={`w-full rounded-lg border bg-black/20 px-4 py-2 text-white placeholder-white/50 focus:outline-none focus:ring-1 ${
										fieldErrors.email
											? "border-red-400 focus:border-red-400 focus:ring-red-400"
											: "border-white/20 focus:border-blue-400 focus:ring-blue-400"
									}`}
									required
									aria-invalid={!!fieldErrors.email}
									aria-describedby='email-error'
								/>
								{fieldErrors.email && (
									<p
										id='email-error'
										className='mt-1 text-xs text-red-400'>
										{fieldErrors.email}
									</p>
								)}
							</div>
							<div>
								<div className='relative'>
									<input
										id='password'
										name='password'
										type={showPassword ? "text" : "password"}
										placeholder='Password'
										value={password}
										onChange={(e) => {
											const newPassword = e.target.value;
											setPassword(newPassword);
											if (isRegistering) {
												setPasswordStrength(
													calculatePasswordStrength(newPassword)
												);
												// Instant validation for confirm password
												if (
													confirmPassword &&
													newPassword !== confirmPassword
												) {
													setFieldErrors((prev) => ({
														...prev,
														confirmPassword: "Passwords do not match.",
													}));
												} else {
													setFieldErrors((prev) => ({
														...prev,
														confirmPassword: "",
													}));
												}
											}
										}}
										onBlur={handleBlur}
										className={`w-full rounded-lg border bg-black/20 px-4 py-2 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-1 ${
											fieldErrors.password
												? "border-red-400 focus:border-red-400 focus:ring-red-400"
												: "border-white/20 focus:border-blue-400 focus:ring-blue-400"
										}`}
										required
										aria-invalid={!!fieldErrors.password}
										aria-describedby='password-error'
									/>
									<button
										type='button'
										onClick={() => setShowPassword(!showPassword)}
										className='absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-white'
										aria-label={
											showPassword ? "Hide password" : "Show password"
										}>
										{showPassword ? (
											<FaEye className='h-5 w-5' />
										) : (
											<FaEyeSlash className='h-5 w-5' />
										)}
									</button>
								</div>
								{fieldErrors.password && (
									<p
										id='password-error'
										className='mt-1 text-xs text-red-400'>
										{fieldErrors.password}
									</p>
								)}
								{isRegistering && (
									<PasswordStrengthIndicator score={passwordStrength} />
								)}
							</div>
							{isRegistering && (
								<div>
									<div className='relative'>
										<input
											id='confirmPassword'
											name='confirmPassword'
											type={showPassword ? "text" : "password"}
											placeholder='Confirm Password'
											value={confirmPassword}
											onChange={(e) => {
												const newConfirm = e.target.value;
												setConfirmPassword(newConfirm);
												if (newConfirm !== password) {
													setFieldErrors((prev) => ({
														...prev,
														confirmPassword: "Passwords do not match.",
													}));
												} else {
													setFieldErrors((prev) => ({
														...prev,
														confirmPassword: "",
													}));
												}
											}}
											onBlur={handleBlur}
											className={`w-full rounded-lg border bg-black/20 px-4 py-2 pr-10 text-white placeholder-white/50 focus:outline-none focus:ring-1 ${
												fieldErrors.confirmPassword
													? "border-red-400 focus:border-red-400 focus:ring-red-400"
													: "border-white/20 focus:border-blue-400 focus:ring-blue-400"
											}`}
											required
											aria-invalid={!!fieldErrors.confirmPassword}
											aria-describedby='confirm-password-error'
										/>
										<button
											type='button'
											onClick={() => setShowPassword(!showPassword)}
											className='absolute inset-y-0 right-0 flex items-center pr-3 text-white/50 hover:text-white'
											aria-label={
												showPassword ? "Hide password" : "Show password"
											}>
											{showPassword ? (
												<FaEyeSlash className='h-5 w-5' />
											) : (
												<FaEye className='h-5 w-5' />
											)}
										</button>
									</div>
									{fieldErrors.confirmPassword && (
										<p
											id='confirm-password-error'
											className='mt-1 text-xs text-red-400'>
											{fieldErrors.confirmPassword}
										</p>
									)}
								</div>
							)}
							<div className='!mt-6'>
								<button
									type='submit'
									disabled={isSubmitting}
									className='w-full rounded-lg bg-blue-500 py-3 px-4 font-semibold text-white transition-colors hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-blue-400/50'>
									{isRegistering ? "Register" : "Sign In"}
								</button>
							</div>
						</form>
						<p className='mt-6 text-center text-sm text-white/80'>
							{isRegistering
								? "Already have an account? "
								: "Don't have an account? "}
							<button
								onClick={() => {
									const newIsRegistering = !isRegistering;
									setIsRegistering(newIsRegistering);
									setFieldErrors({
										username: "",
										email: "",
										password: "",
										confirmPassword: "",
									});
									if (newIsRegistering) {
										setPasswordStrength(calculatePasswordStrength(password));
									} else {
										setPasswordStrength(0);
									}
								}}
								className='font-semibold text-blue-400 hover:underline'>
								{isRegistering ? "Sign In" : "Register"}
							</button>
						</p>
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
