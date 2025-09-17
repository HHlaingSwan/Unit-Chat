import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router";
import { AuthProvider } from "./context/AuthContext.tsx";
import ProtectedRoute from "./components/ProtectedRoute.tsx";
import Login from "./Login.tsx";

const router = createBrowserRouter([
	{
		path: "/",
		element: <Login />,
	},
	{
		// This is the protected route layout
		element: <ProtectedRoute />,
		children: [
			{
				path: "/app",
				element: <App />,
			},
		],
	},
]);

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<AuthProvider>
			<RouterProvider router={router} />
		</AuthProvider>
	</StrictMode>
);
