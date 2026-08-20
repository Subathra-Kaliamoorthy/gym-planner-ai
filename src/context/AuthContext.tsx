import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { TrainingPlan, User, UserProfile } from "../types";
import { authClient } from "../lib/auth";
import { api } from "../lib/api";

const ANON_USER_ID_KEY = "gymai_anon_user_id";

function getAnonymousUserId() {
  let id = localStorage.getItem(ANON_USER_ID_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(ANON_USER_ID_KEY, id);
  }
  return id;
}

interface AuthContextType {
  user: User | null;
  plan: TrainingPlan | null;
  isLoading: boolean;
  hasCheckedPlan: boolean;
  saveProfile: (
    profile: Omit<UserProfile, "userId" | "updatedAt">,
  ) => Promise<void>;
  generatePlan: () => Promise<void>;
  refreshData: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [neonUser, setNeonUser] = useState<any>(null);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasCheckedPlan, setHasCheckedPlan] = useState(false);
  const isRefreshingRef = useRef(false);

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
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, []);

  const userId = useMemo(
    () => neonUser?.id ?? getAnonymousUserId(),
    [neonUser?.id],
  );

  // refreshData memoize
  const refreshData = useCallback(async () => {
    if (!neonUser || isRefreshingRef.current) return;

    isRefreshingRef.current = true;
    setHasCheckedPlan(false);

    try {
      const planData = await api.getCurrentPlan(neonUser.id).catch(() => null);
      if (planData) {
        setPlan({
          id: planData.id,
          userId: planData.userId,
          overview: planData.planJson.overview,
          weeklySchedule: planData.planJson.weeklySchedule,
          progression: planData.planJson.progression,
          version: planData.version,
          createdAt: planData.createdAt,
        });
      } else {
        setPlan(null);
      }
    } catch (error) {
      console.error("Error refreshing data:", error);
      setPlan(null);
    } finally {
      isRefreshingRef.current = false;
      setHasCheckedPlan(true);
    }
  }, [userId]);

  useEffect(() => {
    if (isLoading) return;

    void refreshData();
  }, [userId, isLoading, refreshData]);

  async function saveProfile(
    profileData: Omit<UserProfile, "userId" | "updatedAt">,
  ) {
    await api.saveProfile(userId, profileData);
    await refreshData();
  }

  async function generatePlan() {
    await api.generatePlan(userId);
    await refreshData();
  }

  return (
    <AuthContext.Provider
      value={{
        user: neonUser,
        plan,
        isLoading,
        hasCheckedPlan,
        saveProfile,
        generatePlan,
        refreshData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}