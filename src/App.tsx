import {
	Briefcase,
	Coffee,
	Home,
	Menu as MenuIcon,
	Music,
	Settings,
} from "lucide-react";
import {
	Link,
	Route,
	BrowserRouter as Router,
	Routes,
	useLocation,
} from "react-router-dom";

import { cn } from "@/lib/utils";

import { Toaster } from "./components/ui/toaster";
import HomePage from "./pages/Home";
import JobsPage from "./pages/Jobs";
import MenuPage from "./pages/Menu";
import MusicPage from "./pages/Music";

const NavItem = ({ Icon, to, label }) => {
	const location = useLocation();
	const isActive = location.pathname === to;

	return (
		<Link
			to={to}
			className={cn(
				"flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground",
				isActive && "bg-neutral-200 text-neutral-800"
			)}
		>
			<Icon className="h-5 w-5" />
			<span className="sr-only">{label}</span>
		</Link>
	);
};

const Layout = ({ children }) => (
	<div className="flex min-h-screen w-full flex-col bg-muted/40">
		<aside className="fixed inset-y-0 left-0 z-10 flex w-14 flex-col border-r bg-background">
			<nav className="flex flex-col items-center gap-4 px-2 py-4">
				<Link
					to="/"
					className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground"
				>
					<Coffee className="h-5 w-5" />
					<span className="sr-only">JavaJam Coffee House</span>
				</Link>
			</nav>
			<nav className="flex flex-1 flex-col items-center gap-4 px-2 py-4">
				<NavItem Icon={Home} to="/" label="Home" />
				<NavItem Icon={MenuIcon} to="/menu" label="Menu" />
				<NavItem Icon={Briefcase} to="/jobs" label="Jobs" />
				<NavItem Icon={Music} to="/music" label="Music" />
			</nav>
			<nav className="flex flex-col items-center gap-4 px-2 py-4">
				<NavItem Icon={Settings} to="/settings" label="Settings" />
			</nav>
		</aside>
		<main className="ml-12 flex-1 flex items-center justify-center px-10 bg-gray-100">
			{children}
		</main>
		<footer className="bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-300 py-8">
			<div className="container mx-auto text-center">
				<p className="mb-2">
					&copy; 2024 JavaJam Coffee House. All rights reserved.
				</p>
				<p>
					<a
						href="mailto:contact@javajam.com"
						className="hover:underline"
					>
						gabrielle@suharjono.com
					</a>
				</p>
			</div>
		</footer>
	</div>
);

const SettingsPage = () => (
	<div>
		<h1 className="text-3xl font-bold mb-6">Settings</h1>
		<p>Manage your account and preferences.</p>
	</div>
);

export default function App() {
	return (
		<Router>
			<Layout>
				<Routes>
					<Route path="/" element={<HomePage />} />
					<Route path="/menu" element={<MenuPage />} />
					<Route path="/jobs" element={<JobsPage />} />
					<Route path="/music" element={<MusicPage />} />
					<Route path="/settings" element={<SettingsPage />} />
				</Routes>
			</Layout>
			<Toaster />
		</Router>
	);
}
