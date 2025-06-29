
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Eye, EyeOff } from 'lucide-react';

const Login: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const { setUser } = useAppContext();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API request delay
    setTimeout(() => {
      // Simple validation
      if (!email || !password || (!isLogin && !name)) {
        toast({
          title: "Missing information",
          description: "Please fill in all fields",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }
      
      // Create user object
      const user = {
        id: '123456',
        name: isLogin ? 'Robinson Kipkemboi' : name,
        email: email,
        profile: {
          dob: '',
          gender: '',
          phone: '',
          address: '',
          bio: '',
          joinedDate: new Date().toISOString()
        }
      };
      
      // Set user in context
      setUser(user);
      
      // Show success message
      toast({
        title: isLogin ? "Welcome back!" : "Account created!",
        description: isLogin ? "You've successfully logged in" : "Your account has been created successfully",
      });
      
      // Navigate to home page
      navigate('/');
      
      setIsLoading(false);
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-b from-accent/30 to-background">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-gray-50 p-8 transition-all animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold sf-display mb-2">WellnessConnect</h1>
          <p className="text-muted-foreground">
            {isLogin ? "Welcome back" : "Create your account"}
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name
              </label>
              <Input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="apple-input"
              />
            </div>
          )}
          
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="apple-input"
            />
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium">
              Password
            </label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="apple-input pr-10"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
          
          {isLogin && (
            <div className="text-right">
              <a href="#" className="text-sm text-primary hover:underline">
                Forgot your password?
              </a>
            </div>
          )}
          
          <Button 
            type="submit" 
            className="w-full apple-button"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : isLogin ? "Sign In" : "Create Account"}
          </Button>
        </form>
        
        <div className="mt-6 text-center text-sm">
          <p className="text-muted-foreground">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="ml-1 text-primary hover:underline focus:outline-none"
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </div>
        
        <div className="mt-8 text-center text-xs text-muted-foreground">
          <p>
            By {isLogin ? "signing in" : "creating an account"}, you agree to our
          </p>
          <p className="mt-1">
            <a href="#" className="text-primary hover:underline">Terms of Service</a>
            {" • "}
            <a href="#" className="text-primary hover:underline">Privacy Policy</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
