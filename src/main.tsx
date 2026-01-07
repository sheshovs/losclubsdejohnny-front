import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import App from "./App.tsx"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { AuthProvider } from "./context/AuthContext.tsx"
import { BrowserRouter } from "react-router"
import { SnackbarProvider } from "notistack"

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			refetchOnMount: true,
			refetchOnWindowFocus: false,
			refetchOnReconnect: false,
			refetchInterval: false,
		},
	},
})

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<QueryClientProvider client={queryClient}>
			<AuthProvider>
				<SnackbarProvider>
					<BrowserRouter>
						<App />
					</BrowserRouter>
				</SnackbarProvider>
			</AuthProvider>
		</QueryClientProvider>
	</StrictMode>
)
