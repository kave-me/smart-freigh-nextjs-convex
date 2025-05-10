import * as React from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";

interface User {
  _id: Id<"users">;
  _creationTime: number;
  clerkId: string;
  email?: string;
  name?: string;
}

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  userId: Id<"users"> | null;
}

interface AuthContextType extends AuthState {
  signIn: () => Promise<boolean>;
  signOut: () => Promise<boolean>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  // For MVP, we're always getting the first user from the database
  const firstUser = useQuery(api.myFunctions.getFirstUser);

  // Initialize auth state
  const [authState, setAuthState] = React.useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    userId: null,
  });

  // Mock sign in function for MVP
  const signIn = async (): Promise<boolean> => {
    console.log("Sign-in called - no auth for MVP");
    return true;
  };

  // Mock sign out function for MVP
  const signOut = async (): Promise<boolean> => {
    console.log("Sign-out called - no auth for MVP");
    return true;
  };

  // Update auth state when firstUser changes
  React.useEffect(() => {
    if (firstUser) {
      setAuthState({
        user: firstUser,
        isLoading: false,
        isAuthenticated: true,
        userId: firstUser._id,
      });
    } else {
      setAuthState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [firstUser]);

  const contextValue: AuthContextType = {
    ...authState,
    signIn,
    signOut,
  };

  return React.createElement(
    AuthContext.Provider,
    { value: contextValue },
    children,
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

// Helper hook to get the current user ID
export function useCurrentUserId(): Id<"users"> | null {
  const { userId } = useAuth();
  return userId;
}
