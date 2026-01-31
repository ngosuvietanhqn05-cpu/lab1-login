import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProductCard({ product }) {
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

      <CardContent className="space-y-2">
        <p className="text-sm text-slate-600">{product.description}</p>
        <p className="text-lg font-semibold">${product.price}</p>
      </CardContent>
    </Card>
  );
}
