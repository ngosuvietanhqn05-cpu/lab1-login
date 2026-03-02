import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function OrderCard({ order }) {
  const date = new Date(order.created_at).toLocaleString();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-base">Order</CardTitle>
        <span className="text-sm text-slate-300">{order.status}</span>
      </CardHeader>

      <CardContent className="space-y-2">
        <div className="text-sm text-slate-300">Date: {date}</div>
        <div className="font-semibold">
          Total: ${Number(order.total_price).toFixed(2)}
        </div>

        <div className="mt-2 space-y-1 text-sm text-slate-300">
          {order.items?.map((it, idx) => (
            <div key={idx} className="flex justify-between">
              <span>
                {it.name} × {it.quantity}
              </span>
              <span>${Number(it.price * it.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}