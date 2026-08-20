import { Link } from "react-router-dom";
import { Info } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { Button } from "../ui/Button";

export default function AnonymousPlanBanner() {
  const { user, plan } = useAuth();

  if (user || !plan) return null;

  return (
    <div className="mt-16 bg-[var(--color-accent)]/10 border-b border-[var(--color-accent)]/30">
      <div className="max-w-6xl mx-auto px-6 py-3 flex flex-col sm:flex-row items-center justify-center gap-3 text-center sm:text-left">
        <p className="text-sm text-[var(--color-foreground)] flex items-center gap-2">
          <Info className="w-4 h-4 text-[var(--color-accent)] shrink-0" />
          To save your profile and plan, please sign in.
        </p>
        <Link to="/auth/sign-in">
          <Button size="sm">Sign In</Button>
        </Link>
      </div>
    </div>
  );
}
