
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Search, MessageSquare, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/context/AppContext';
import { useToast } from '@/hooks/use-toast';
import { NotificationBell } from '@/components/common/NotificationBell';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { 
    user, 
    setUser, 
    setIsAuthModalOpen, 
    setAuthMode,
    setIsChatModalOpen
  } = useAppContext();
  const { toast } = useToast();
  
  const toggleMenu = () => setIsOpen(!isOpen);
  
  // Check if we're on the home page
  const isHomePage = location.pathname === '/';
  
  // Handle scroll event to change navbar style
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignIn = () => {
    setAuthMode('signin');
    setIsAuthModalOpen(true);
    setIsOpen(false);
  };

  const handleSignUp = () => {
    setAuthMode('signup');
    setIsAuthModalOpen(true);
    setIsOpen(false);
  };

  const handleSignOut = () => {
    setUser(null);
    toast({
      title: "Signed out successfully",
      description: "Come back soon!",
    });
  };

  const handleChatClick = () => {
    setIsChatModalOpen(true);
  };

  const getInitials = (name: string = '') => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase();
  };

  return (
    <motion.header 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.3 }}
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        isScrolled || !isHomePage 
          ? 'bg-white/90 backdrop-blur-md shadow-sm py-3' 
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container px-4 mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
            WellnessConnect
          </span>
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/' 
                ? 'text-primary' 
                : 'text-foreground hover:text-primary'
            }`}
          >
            Home
          </Link>
          <Link
            to="/find-doctors"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname.includes('/find-doctors') || location.pathname.includes('/doctor/')
                ? 'text-primary' 
                : 'text-foreground hover:text-primary'
            }`}
          >
            Find Doctors
          </Link>
          <Link
            to="/symptom-checker"
            className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              location.pathname === '/symptom-checker' 
                ? 'text-primary' 
                : 'text-foreground hover:text-primary'
            }`}
          >
            Symptom Checker
          </Link>
        </nav>
        
        {/* Desktop Right Nav */}
        <div className="hidden md:flex items-center space-x-2">
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/30 transition-colors"
          >
            <Search size={20} />
          </Button>
          
          <NotificationBell />
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/30 transition-colors"
            onClick={handleChatClick}
          >
            <MessageSquare size={20} />
          </Button>
          
          <div className="h-6 w-px bg-border mx-1"></div>
          
          {user ? (
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Avatar className="h-9 w-9 border-2 border-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                
                <div className="hidden lg:block">
                  <Link to="/profile" className="text-sm font-medium block hover:text-primary transition-colors">
                    {user.name}
                  </Link>
                  <span className="text-xs text-muted-foreground">{user.email}</span>
                </div>
              </div>
              
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignOut}
                className="hover:bg-red-50 hover:text-red-600 transition-colors"
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleSignIn}
                className="hover:bg-accent/50 transition-colors"
              >
                Sign In
              </Button>
              <Button 
                size="sm" 
                onClick={handleSignUp}
                className="bg-primary hover:bg-primary/90 text-white hover:scale-105 transition-all"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>
        
        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-3">
          {user && (
            <>
              <NotificationBell />
              <Link to="/profile">
                <Avatar className="h-8 w-8 border border-primary/10">
                  <AvatarFallback className="bg-primary/5 text-primary text-xs">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
              </Link>
            </>
          )}
          
          <Button 
            variant="ghost" 
            size="icon" 
            className="hover:bg-accent/30 transition-colors"
            onClick={toggleMenu}
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>
      </div>
      
      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-background"
        >
          <div className="container px-4 py-6 mx-auto">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/"
                className={`px-3 py-3 rounded-md text-base font-medium ${
                  location.pathname === '/' 
                    ? 'bg-accent text-primary' 
                    : 'text-foreground hover:bg-accent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/find-doctors"
                className={`px-3 py-3 rounded-md text-base font-medium ${
                  location.pathname.includes('/find-doctors') || location.pathname.includes('/doctor/')
                    ? 'bg-accent text-primary' 
                    : 'text-foreground hover:bg-accent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Find Doctors
              </Link>
              <Link
                to="/symptom-checker"
                className={`px-3 py-3 rounded-md text-base font-medium ${
                  location.pathname === '/symptom-checker' 
                    ? 'bg-accent text-primary' 
                    : 'text-foreground hover:bg-accent'
                }`}
                onClick={() => setIsOpen(false)}
              >
                Symptom Checker
              </Link>
              
              <div className="border-t border-border my-2 pt-4">
                {user ? (
                  <>
                    <div className="px-3 py-2 mb-2">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block px-3 py-3 rounded-md text-base font-medium mb-2 hover:bg-accent"
                      onClick={() => setIsOpen(false)}
                    >
                      <User size={18} className="inline-block mr-2" />
                      My Profile
                    </Link>
                    <Button 
                      className="w-full mb-3" 
                      variant="outline" 
                      onClick={() => {
                        handleSignOut();
                        setIsOpen(false);
                      }}
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button 
                      className="mb-3 w-full bg-primary hover:bg-primary/90 text-white" 
                      onClick={handleSignUp}
                    >
                      Sign Up
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full" 
                      onClick={handleSignIn}
                    >
                      Sign In
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
};
