
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import mapboxgl from 'mapbox-gl';
import { AnimatePresence, motion } from "framer-motion";

import { AppProvider, useAppContext } from "@/context/AppContext";
import { Navbar } from "@/components/layout/Navbar";
import { AuthModal } from "@/components/auth/AuthModal";
import { ChatModal } from "@/components/common/ChatModal";
import { LiveChatBubble } from "@/components/common/LiveChatBubble";
import { FavoritesDrawer } from "@/components/common/FavoritesDrawer";
import Home from "@/pages/Home";
import FindDoctors from "@/pages/FindDoctors";
import DoctorProfile from "@/pages/DoctorProfile";
import SymptomChecker from "@/pages/SymptomChecker";
import UserProfile from "@/pages/UserProfile";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import FAQs from "@/pages/FAQs";
import { useState } from "react";

const queryClient = new QueryClient();

// Mapbox access token
if (typeof mapboxgl !== 'undefined') {
  mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZS11c2VyIiwiYSI6ImNsbjRjcW9vOTAxbGQycW80MDk4NzBiN2QifQ.5yS0tQ7WkKrRdQ3v_rr6yg';
}

// Protected route component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAppContext();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return <>{children}</>;
};

// Animated routes wrapper
const AnimatedRoutes = () => {
  const location = useLocation();
  const { user } = useAppContext();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3 }}
        className="min-h-screen"
      >
        <Routes location={location}>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={
            user ? <Home /> : <Navigate to="/login" replace />
          } />
          <Route path="/find-doctors" element={
            <ProtectedRoute><FindDoctors /></ProtectedRoute>
          } />
          <Route path="/doctor/:id" element={
            <ProtectedRoute><DoctorProfile /></ProtectedRoute>
          } />
          <Route path="/symptom-checker" element={
            <ProtectedRoute><SymptomChecker /></ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute><UserProfile /></ProtectedRoute>
          } />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/faqs" element={<FAQs />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

// Wrapper component to use hooks
const AppContent = () => {
  const { isChatModalOpen, setIsChatModalOpen, user } = useAppContext();
  const [isFavoritesDrawerOpen, setIsFavoritesDrawerOpen] = useState(false);
  
  return (
    <BrowserRouter>
      <Navbar />
      <AuthModal />
      
      {user && (
        <>
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="fixed bottom-5 right-5 z-40"
          >
            <LiveChatBubble />
          </motion.div>
          <ChatModal isOpen={isChatModalOpen} onClose={() => setIsChatModalOpen(false)} />
          <FavoritesDrawer isOpen={isFavoritesDrawerOpen} onClose={() => setIsFavoritesDrawerOpen(false)} />
          
          {/* Favorites Button */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.7 }}
            className="fixed top-24 right-5 z-30"
          >
            <button
              onClick={() => setIsFavoritesDrawerOpen(true)}
              className="bg-white p-3 rounded-full shadow-md hover:shadow-lg transition-all hover:scale-110 duration-300"
              aria-label="View favorites"
            >
              <Heart size={20} className="text-primary" />
            </button>
          </motion.div>
        </>
      )}
      
      <main className="min-h-screen">
        <AnimatedRoutes />
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container px-4 mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <p className="text-sm text-muted-foreground">© 2024 WellnessConnect. All rights reserved.</p>
            </div>
            <div className="flex space-x-6">
              <a href="/privacy-policy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</a>
              <a href="/faqs" className="text-sm text-muted-foreground hover:text-primary transition-colors">FAQs</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Service</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact Us</a>
            </div>
          </div>
        </div>
      </footer>
    </BrowserRouter>
  );
};

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AppProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <AppContent />
        </TooltipProvider>
      </AppProvider>
    </QueryClientProvider>
  );
};

export default App;
