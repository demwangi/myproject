
import { useAppContext } from "@/context/AppContext";
import { useToast } from "@/hooks/use-toast";

// Define User type to match what's expected in the app
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  address?: string;
}

export const useUser = () => {
  const { user, setUser } = useAppContext();
  const { toast } = useToast();

  const login = (userData: User) => {
    try {
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      // Create a welcome back notification if it's an existing user
      toast({
        title: "Welcome back!",
        description: `You're now logged in as ${userData.name}`,
      });
      
      return true;
    } catch (error) {
      console.error("Error during login:", error);
      toast({
        title: "Login failed",
        description: "There was a problem logging you in. Please try again.",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    try {
      setUser(null);
      localStorage.removeItem('user');
      
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
      
      return true;
    } catch (error) {
      console.error("Error during logout:", error);
      return false;
    }
  };

  return {
    user,
    login,
    logout,
    isLoggedIn: !!user
  };
};
