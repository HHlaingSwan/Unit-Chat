import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider, useAuth } from "./context/AuthContext.tsx";
import Login from "./Login.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Root = () => {
	const { user, loading } = useAuth();

	if (loading) {
		return (
			<div className='relative flex h-screen w-screen items-center justify-center'>
				<img
					src='/bg.png'
					alt='background'
					className='h-full w-full object-cover'
				/>
				<div className='absolute flex h-full w-full items-center justify-center bg-black/50'>
					<div className='h-16 w-16 animate-spin rounded-full border-4 border-solid border-blue-400 border-t-transparent'></div>
				</div>
			</div>
		);
	}

	return user ? <App /> : <Login />;
};

const router = createBrowserRouter([{ path: "/", Component: Root }]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
			<ToastContainer
				position='top-right'
				autoClose={5000}
				hideProgressBar={false}
				newestOnTop={false}
				closeOnClick
				rtl={false}
				pauseOnFocusLoss
				draggable
				pauseOnHover
				theme='dark'
			/>
		</AuthProvider>
	</StrictMode>
);
