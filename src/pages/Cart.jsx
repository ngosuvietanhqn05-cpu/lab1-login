import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";


export default function Cart() {
  const { cart, updateQuantity, removeFromCart, totalPrice } = useCart();

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <h1 className="text-xl font-bold">Your Cart</h1>

        <Button asChild variant="secondary">
          <Link to="/">Back to Home</Link>
        </Button>
      </header>

      <main className="mx-auto max-w-6xl p-4 space-y-4">
        {cart.length === 0 ? (
          <p className="text-slate-300">Cart is empty.</p>
        ) : (
          <>
            <div className="space-y-3">
              {cart.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-base">{item.name}</CardTitle>
                    <Button
                      variant="destructive"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove
                    </Button>
                  </CardHeader>

                  <CardContent className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-16 w-24 rounded object-cover"
                      />
                      <div className="text-sm text-slate-300">
                        ${item.price} each
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-300">Qty</span>
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, Number(e.target.value))
                        }
                        className="w-20"
                      />
                    </div>

                    <div className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card>
              <CardContent className="flex items-center justify-between p-4">
                <span className="text-lg font-bold">Total</span>
                <span className="text-lg font-bold">
                  ${totalPrice.toFixed(2)}
                </span>
              </CardContent>
            </Card>
          </>
        )}
      </main>
    </div>
  );
}
