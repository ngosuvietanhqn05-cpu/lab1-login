import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import ChatInterface from "../components/ChatInterface";

export default function Chat() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <h1 className="text-xl font-bold">AI Chat Support</h1>

        <Button asChild variant="secondary">
          <Link to="/">Back to Home</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-3xl p-4">
        <ChatInterface />
      </main>
    </div>
  );
}