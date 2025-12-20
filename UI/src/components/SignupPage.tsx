import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Logo } from "@/components/Logo";

export function SignupPage() {
  const [username, setUsername] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("https://untolerative-len-rumblingly.ngrok-free.dev/auth/get-username", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name: username }),
      });

      if (!response.ok) {
        throw new Error("Failed to process username");
      }

      const data = await response.json();
      
      if (data.redirectTo) {
         window.location.href = data.redirectTo;
         return;
      }

      navigate(`/signup/connect?username=${encodeURIComponent(username)}`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-black text-white p-4 font-sans">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-2 text-center">
           <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/5 border border-white/10">
            <Logo className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            Create an account
          </h1>
          <p className="text-sm text-zinc-400">
            Enter your username to get started
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <div className="grid gap-2">
            <Input
              id="username"
              placeholder="Username"
              type="text"
              autoCapitalize="none"
              autoCorrect="off"
              disabled={isLoading}
              className="bg-black border-white/10 text-white placeholder:text-zinc-500 focus-visible:ring-white/20 h-10"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          {error && (
            <p className="text-sm text-red-500 text-center">{error}</p>
          )}

          <Button disabled={isLoading} className="bg-white text-black hover:bg-zinc-200 h-10 font-medium">
            {isLoading ? "Processing..." : "Continue"}
          </Button>
        </form>

        <div className="text-center text-sm text-zinc-400">
           <Link to="/login" className="underline hover:text-white underline-offset-4">
              Already have an account? Log In
           </Link>
        </div>
      </div>
    </div>
  );
}
