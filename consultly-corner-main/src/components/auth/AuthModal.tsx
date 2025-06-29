
import React, { useState } from 'react';
import { X, User, Mail, Lock, ArrowRight } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { Button } from '@/components/common/Button';
import { useToast } from '@/hooks/use-toast';

export const AuthModal: React.FC = () => {
  const { 
    isAuthModalOpen, 
    setIsAuthModalOpen, 
    authMode, 
    setAuthMode,
    setUser
  } = useAppContext();
  const { toast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const toggleAuthMode = () => {
    setAuthMode(authMode === 'signin' ? 'signup' : 'signin');
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call
    try {
      setTimeout(() => {
        // Mock successful auth
        const mockUser = {
          id: '123',
          name: authMode === 'signup' ? name : 'Jane Doe',
          email: email
        };
        
        setUser(mockUser);
        setIsAuthModalOpen(false);
        
        toast({
          title: authMode === 'signin' ? 'Signed in successfully' : 'Account created successfully',
          description: `Welcome ${mockUser.name}!`,
        });
        
        // Reset form
        setEmail('');
        setPassword('');
        setName('');
        setIsLoading(false);
      }, 1500);
    } catch (error) {
      toast({
        title: 'Authentication failed',
        description: 'Please check your credentials and try again',
        variant: 'destructive',
      });
      setIsLoading(false);
    }
  };

  if (!isAuthModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIsAuthModalOpen(false)}></div>
      
      <div 
        className="relative bg-card w-full max-w-md rounded-2xl shadow-xl overflow-hidden animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h3 className="text-lg font-medium">
            {authMode === 'signin' ? 'Sign In' : 'Create Account'}
          </h3>
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="p-1 rounded-full hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        
        {/* Modal Body */}
        <div className="p-5">
          <form onSubmit={handleAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User size={16} className="text-muted-foreground" />
                  </div>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>
            )}
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-muted-foreground" />
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-muted-foreground" />
                </div>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-border rounded-md focus:outline-none focus:ring-1 focus:ring-primary"
                  placeholder={authMode === 'signin' ? 'Enter your password' : 'Create a password'}
                  required
                />
              </div>
            </div>
            
            <Button
              type="submit"
              fullWidth
              isLoading={isLoading}
              rightIcon={!isLoading ? <ArrowRight size={16} /> : undefined}
            >
              {authMode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          
          <div className="mt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}
              <button 
                className="ml-1 text-primary hover:underline focus:outline-none"
                onClick={toggleAuthMode}
              >
                {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
