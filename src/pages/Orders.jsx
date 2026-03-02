import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabaseClient";
import { Button } from "../components/ui/button";
import OrderCard from "../components/OrderCard";

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    async function load() {
      setErrorMsg("");
      setLoading(true);

      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) setErrorMsg(error.message);
      else setOrders(data || []);

      setLoading(false);
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <h1 className="text-xl font-bold">Order History</h1>
        <Button asChild variant="secondary">
          <Link to="/">Back to Home</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-6xl p-4 space-y-4">
        {loading && <p className="text-slate-300">Loading...</p>}
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}

        {!loading && !errorMsg && orders.length === 0 && (
          <p className="text-slate-300">No orders yet.</p>
        )}

        {orders.map((o) => (
          <OrderCard key={o.id} order={o} />
        ))}
      </main>
    </div>
  );
}