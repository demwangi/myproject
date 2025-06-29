
import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { useAppContext } from '@/context/AppContext';
import { useDoctors } from '@/hooks/useDoctors';
import { DoctorCard } from '@/components/common/DoctorCard';
import { useToast } from '@/hooks/use-toast';
import { SpecialtyFilter } from '@/components/common/SpecialtyFilter';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useDebouncedCallback } from '@/hooks/useDebounce';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type SortOption = 'rating' | 'price_low' | 'price_high' | 'distance';

const FindDoctors: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const specialtyParam = searchParams.get('specialty') || 'all';
  const { toast } = useToast();
  
  const { 
    selectedSpecialty, 
    setSelectedSpecialty,
    searchQuery,
    setSearchQuery 
  } = useAppContext();
  
  const [sortBy, setSortBy] = useState<SortOption>('rating');
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(false);
  const [isFiltering, setIsFiltering] = useState<boolean>(false);
  
  const { doctors: allDoctors } = useDoctors(selectedSpecialty, searchQuery);
  
  // Debounced filter application to reduce UI jitter
  const debouncedFilter = useDebouncedCallback(() => {
    setIsFiltering(false);
  }, 300);
  
  // Filter and sort doctors based on selected filters
  const doctors = React.useMemo(() => {
    let filteredDoctors = [...allDoctors];
    
    // Filter by price range
    filteredDoctors = filteredDoctors.filter(
      doc => doc.consultationFee >= priceRange[0] && doc.consultationFee <= priceRange[1]
    );
    
    // Filter by availability today
    if (showOnlyAvailable) {
      const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });
      filteredDoctors = filteredDoctors.filter(
        doc => doc.availability[today] && doc.availability[today].length > 0
      );
    }
    
    // Sort doctors
    switch (sortBy) {
      case 'price_low':
        return filteredDoctors.sort((a, b) => a.consultationFee - b.consultationFee);
      case 'price_high':
        return filteredDoctors.sort((a, b) => b.consultationFee - a.consultationFee);
      case 'distance':
        // Would normally sort by distance, but we don't have user location
        // For now, just return as is
        return filteredDoctors;
      case 'rating':
      default:
        return filteredDoctors.sort((a, b) => b.rating - a.rating);
    }
  }, [allDoctors, priceRange, showOnlyAvailable, sortBy]);
  
  // Sync URL params with state
  useEffect(() => {
    if (specialtyParam !== selectedSpecialty) {
      setSelectedSpecialty(specialtyParam as any);
    }
  }, [specialtyParam, selectedSpecialty, setSelectedSpecialty]);
  
  // Update URL when selected specialty changes
  useEffect(() => {
    const params = new URLSearchParams(searchParams);
    if (selectedSpecialty !== 'all') {
      params.set('specialty', selectedSpecialty);
    } else {
      params.delete('specialty');
    }
    setSearchParams(params);
  }, [selectedSpecialty, setSearchParams, searchParams]);
  
  const handleSpecialtyChange = useCallback((specialty: string) => {
    setIsFiltering(true);
    setSelectedSpecialty(specialty as any);
    
    // Provide user feedback when filter is applied
    toast({
      title: "Filter Applied",
      description: specialty === 'all' 
        ? "Showing all specialists" 
        : `Filtered by ${specialty}s`,
      duration: 2000,
    });
    
    debouncedFilter();
  }, [setSelectedSpecialty, toast, debouncedFilter]);
  
  const handleSearchChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setIsFiltering(true);
    setSearchQuery(e.target.value);
    debouncedFilter();
  }, [setSearchQuery, debouncedFilter]);
  
  const handleSortChange = useCallback((sort: SortOption) => {
    setIsFiltering(true);
    setSortBy(sort);
    
    toast({
      title: "Sort Applied",
      description: `Sorted by ${sort.replace('_', ' ')}`,
      duration: 2000,
    });
    
    debouncedFilter();
  }, [toast, debouncedFilter]);
  
  const handlePriceRangeChange = useCallback((range: [number, number]) => {
    setIsFiltering(true);
    setPriceRange(range);
    debouncedFilter();
  }, [debouncedFilter]);
  
  const handleAvailabilityChange = useCallback((isAvailable: boolean) => {
    setIsFiltering(true);
    setShowOnlyAvailable(isAvailable);
    
    if (isAvailable) {
      toast({
        title: "Availability Filter Applied",
        description: "Showing doctors available today",
        duration: 2000,
      });
    }
    
    debouncedFilter();
  }, [toast, debouncedFilter]);
  
  const clearFilters = useCallback(() => {
    setIsFiltering(true);
    setSelectedSpecialty('all');
    setSearchQuery('');
    setSortBy('rating');
    setPriceRange([0, 500]);
    setShowOnlyAvailable(false);
    
    toast({
      title: "Filters Cleared",
      description: "Showing all available doctors",
      duration: 2000,
    });
    
    debouncedFilter();
  }, [setSelectedSpecialty, setSearchQuery, toast, debouncedFilter]);

  // Sort options for dropdown - simplified
  const sortOptions = [
    { value: 'rating', label: 'Top Rated' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' }
  ];

  return (
    <div className="pt-20 pb-16 min-h-screen">
      <div className="container px-4 mx-auto">
        {/* Hero section */}
        <motion.section 
          className="mb-8 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Find Your Specialist</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Connect with gynecologists, psychiatrists, and therapists who can address your specific health needs.
          </p>
          
          {/* Search bar */}
          <div className="max-w-2xl mx-auto relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-muted-foreground" />
            </div>
            <Input
              type="text"
              placeholder="Search by name, specialty, or hospital..."
              className="pl-10 h-12 w-full"
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <Button
                variant="ghost"
                size="sm"
                className="absolute inset-y-0 right-2"
                onClick={() => {
                  setIsFiltering(true);
                  setSearchQuery('');
                  debouncedFilter();
                }}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            )}
          </div>
        </motion.section>
        
        {/* Filter section - simplified */}
        <SpecialtyFilter 
          selectedSpecialty={selectedSpecialty}
          searchQuery={searchQuery}
          onSpecialtyChange={handleSpecialtyChange}
          onClearFilters={clearFilters}
          onSortChange={handleSortChange}
          onPriceRangeChange={handlePriceRangeChange}
          onRatingFilterChange={() => {}} // Rating filter removed but keeping prop for compatibility
          onAvailabilityChange={handleAvailabilityChange}
        />
        
        {/* Results section - with flexible layout */}
        <section className="md:pl-[20%] md:mt-[-10rem]">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-medium">
              {doctors.length} {doctors.length === 1 ? 'Doctor' : 'Doctors'} Available
            </h2>
            
            {/* Compact dropdown hidden as requested */}
          </div>
          
          <AnimatePresence mode="wait">
            {doctors.length > 0 ? (
              <LayoutGroup>
                <motion.div 
                  key="results"
                  className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  layout
                  transition={{ duration: 0.3, layoutDuration: 0.4 }}
                >
                  {doctors.map((doctor) => (
                    <motion.div 
                      key={doctor.id} 
                      className="h-full"
                      layout="position"
                      layoutId={doctor.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.96 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DoctorCard doctor={doctor} />
                    </motion.div>
                  ))}
                </motion.div>
              </LayoutGroup>
            ) : (
              <motion.div 
                key="no-results"
                className="text-center py-12 bg-accent/30 rounded-xl"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-xl font-medium mb-2">No doctors found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or browse all specialists
                </p>
                <Button 
                  onClick={clearFilters}
                  className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90"
                  type="button"
                >
                  View All Doctors
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </section>
      </div>
    </div>
  );
};

export default FindDoctors;
