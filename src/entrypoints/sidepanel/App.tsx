import { Information } from "@/components/information/information"
import { Toaster } from "@/components/ui/toaster"

function App() {
	return (
		<div className="w-full h-full bg-zinc-100">
			<Toaster />
			<Information />
		</div>
	)
}

export default App
