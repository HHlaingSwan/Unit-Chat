import { Navigate, Outlet } from "react-router";
import { useAuth } from "../context/AuthContext.tsx";

const ProtectedRoute = () => {
	const { user, loading } = useAuth();

	if (loading) {
		// You can show a loading spinner or a blank page while checking auth status
		return (
			<div className='flex min-h-screen w-full items-center justify-center'>
				{/* Or a spinner component */}
				<div className='text-xl text-gray-400'>Loading...</div>
			</div>
		);
	}

	// If the user is authenticated, render the child routes.
	// Otherwise, redirect to the login page.
	return user ? (
		<Outlet />
	) : (
		<Navigate
			to='/'
			replace
		/>
	);
};

export default ProtectedRoute;
