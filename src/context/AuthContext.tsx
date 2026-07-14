import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

import { authClient } from "../lib/auth";
import type { User, UserProfile } from "../types";
import { api } from "../lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  saveProfile: (profile: Omit<UserProfile, "userId" | "updatedAt">) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [neonUser, setNeonUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const result = await authClient.getSession();
        if (result && result.data?.user) {
          setNeonUser(result.data.user);
        } else {
          setNeonUser(null);
        }
      } catch (err) {
        setNeonUser(null);
        console.error("Error loading user:", err);
      }
      finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  async function saveProfile(profile: Omit<UserProfile, "userId" | "updatedAt">) {
    if (!neonUser) {
      throw new Error("User is not authenticated");
    }
    await api.saveProfile(neonUser.id, profile);
  }

  return (
    <AuthContext.Provider
      value={{
        user: neonUser,
        isLoading: isLoading,
        saveProfile: saveProfile
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}