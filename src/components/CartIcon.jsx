import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { Button } from "../components/ui/button";


export default function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Button asChild variant="secondary" className="relative">
      <Link to="/cart">
        Cart
        {totalItems > 0 && (
          <span className="ml-2 rounded-full bg-white px-2 py-0.5 text-xs text-black">
            {totalItems}
          </span>
        )}
      </Link>
    </Button>
  );
}
