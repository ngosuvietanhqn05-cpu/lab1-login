import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

import { useCart } from "../context/CartContext";

export default function ProductCard({ product }) {
  const [qty, setQty] = useState(1);
  const { addToCart } = useCart();

  return (
    <Card className="overflow-hidden">
      <div className="aspect-[16/10] w-full overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="h-full w-full object-cover"
        />
      </div>

      <CardHeader>
        <CardTitle className="text-base">{product.name}</CardTitle>
      </CardHeader>

      <CardContent className="space-y-3">
        <p className="text-sm text-slate-600">{product.description}</p>
        <p className="text-lg font-semibold">${product.price}</p>

        <div className="flex items-center gap-2">
          <Input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            className="w-24"
          />
          <Button
            className="flex-1"
            onClick={() => addToCart(product, qty)}
          >
            Add to Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
