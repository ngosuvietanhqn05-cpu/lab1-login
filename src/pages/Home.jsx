import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import { Button } from "@/components/ui/button";

const products = [
  {
    id: 1,
    name: "Wireless Headphones",
    image:
      "https://images.unsplash.com/photo-1518441316520-90aaf5bfa0f4?auto=format&fit=crop&w=800&q=60",
    description: "Comfortable, clear sound, long battery life.",
    price: 49.99,
  },
  {
    id: 2,
    name: "Smart Watch",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=60",
    description: "Track your fitness and notifications on the go.",
    price: 79.0,
  },
  {
    id: 3,
    name: "Mechanical Keyboard",
    image:
      "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=60",
    description: "Tactile feel, fast typing, durable switches.",
    price: 59.5,
  },
  {
    id: 4,
    name: "Desk Lamp",
    image:
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=800&q=60",
    description: "Minimal design with adjustable brightness.",
    price: 19.9,
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <h1 className="text-xl font-bold">Lab 2 - Products</h1>

        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link to="/login">Login</Link>
          </Button>
          <Button asChild>
            <Link to="/register">Register</Link>
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl p-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </main>
    </div>
  );
}
