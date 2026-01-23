import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function App() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center text-2xl">
            Login
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm">Email</label>
            <Input type="email" placeholder="you@example.com" />
          </div>

          <div className="space-y-2">
            <label className="text-sm">Password</label>
            <Input type="password" placeholder="••••••••" />
          </div>

          <Button className="w-full">
            Sign in
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
