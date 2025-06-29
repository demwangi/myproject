
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Filter, X, ChevronDown, SortDesc } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface SpecialtyFilterProps {
  selectedSpecialty: string;
  searchQuery: string;
  onSpecialtyChange: (specialty: string) => void;
  onClearFilters: () => void;
  onSortChange: (sort: string) => void;
  onPriceRangeChange: (range: [number, number]) => void;
  onRatingFilterChange: (rating: number) => void;
  onAvailabilityChange: (isAvailable: boolean) => void;
}

export const SpecialtyFilter: React.FC<SpecialtyFilterProps> = ({
  selectedSpecialty,
  searchQuery,
  onSpecialtyChange,
  onClearFilters,
  onSortChange,
  onPriceRangeChange,
  onAvailabilityChange
}) => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500]);
  const [showOnlyAvailable, setShowOnlyAvailable] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>('rating');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  // Add this to prevent rapid clicking
  const isProcessingClick = useRef(false);

  const handlePriceRangeChange = (value: number[]) => {
    const range: [number, number] = [value[0], value[1]];
    setPriceRange(range);
    onPriceRangeChange(range);
  };

  const handleAvailabilityChange = (checked: boolean) => {
    setShowOnlyAvailable(checked);
    onAvailabilityChange(checked);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
    onSortChange(sort);
  };

  const handleClearFilters = () => {
    setPriceRange([0, 500]);
    setShowOnlyAvailable(false);
    setSortBy('rating');
    onClearFilters();
  };

  // Add debounce handler for specialty change
  const handleSpecialtyClick = (specialty: string) => {
    if (isProcessingClick.current) return;
    
    isProcessingClick.current = true;
    onSpecialtyChange(specialty);
    
    // Release after a short delay
    setTimeout(() => {
      isProcessingClick.current = false;
    }, 300);
  };

  const specialties = [
    { id: 'all', name: 'All Specialists', icon: '👨‍⚕️' },
    { id: 'gynecologist', name: 'Gynecologists', icon: '👩‍⚕️' },
    { id: 'psychiatrist', name: 'Psychiatrists', icon: '🧠' },
    { id: 'therapist', name: 'Therapists', icon: '🤔' }
  ];

  const sortOptions = [
    { id: 'rating', name: 'Top Rated' },
    { id: 'price_low', name: 'Price: Low to High' },
    { id: 'price_high', name: 'Price: High to Low' },
    { id: 'distance', name: 'Distance' }
  ];

  return (
    <>
      {/* Desktop filters */}
      <div className="hidden md:block mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {specialties.map(specialty => (
            <motion.button
              key={specialty.id}
              onClick={() => handleSpecialtyClick(specialty.id)}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "relative overflow-hidden group p-4 rounded-xl border transition-all duration-300",
                selectedSpecialty === specialty.id
                  ? "border-primary bg-primary/5 shadow-sm"
                  : "border-border bg-white hover:bg-accent/30"
              )}
              layout
            >
              <div className="flex flex-col items-center">
                <span className="text-2xl mb-2">{specialty.icon}</span>
                <span className={`font-medium ${selectedSpecialty === specialty.id ? 'text-primary' : 'text-foreground'}`}>
                  {specialty.name}
                </span>
              </div>
              
              {selectedSpecialty === specialty.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute top-2 right-2 bg-primary text-white p-1 rounded-full"
                >
                  <Check size={12} />
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Advanced filters section (sticky on desktop) */}
      <div className="flex mb-8">
        {/* Mobile filter toggle button */}
        <div className="md:hidden">
          <Button 
            variant="outline" 
            className="flex items-center gap-2" 
            onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
          >
            <Filter size={16} />
            Filters
            {(priceRange[0] > 0 || priceRange[1] < 500 || showOnlyAvailable) && (
              <span className="bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                !
              </span>
            )}
          </Button>
        </div>
        
        {/* Mobile filters */}
        {isMobileFilterOpen && (
          <div className="md:hidden fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
            <motion.div 
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              className="fixed inset-y-0 right-0 w-[80%] max-w-sm bg-white shadow-xl p-6 overflow-y-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="rounded-full"
                >
                  <X size={18} />
                </Button>
              </div>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Specialty</h3>
                  <div className="space-y-2">
                    {specialties.map(specialty => (
                      <div 
                        key={specialty.id}
                        className={`py-2 px-3 rounded-lg transition-colors cursor-pointer ${
                          selectedSpecialty === specialty.id 
                            ? 'bg-primary/10 text-primary' 
                            : 'hover:bg-accent'
                        }`}
                        onClick={() => handleSpecialtyClick(specialty.id)}
                      >
                        <div className="flex items-center">
                          <span className="mr-2">{specialty.icon}</span>
                          <span>{specialty.name}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Sort By</h3>
                  <Select 
                    value={sortBy} 
                    onValueChange={handleSortChange}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      {sortOptions.map(option => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <Separator />
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Price Range</h3>
                  <div className="px-2">
                    <Slider
                      defaultValue={[0, 500]}
                      min={0}
                      max={500}
                      step={10}
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={handlePriceRangeChange}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>
                
                <Separator />
                
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="available-mobile"
                    checked={showOnlyAvailable}
                    onCheckedChange={(checked) => handleAvailabilityChange(!!checked)}
                  />
                  <Label htmlFor="available-mobile">Show only available today</Label>
                </div>
                
                <div className="pt-4">
                  <Button
                    variant="secondary"
                    className="w-full"
                    onClick={handleClearFilters}
                  >
                    Clear All Filters
                  </Button>
                </div>
                
                <div className="pt-2">
                  <Button
                    variant="default"
                    className="w-full"
                    onClick={() => setIsMobileFilterOpen(false)}
                  >
                    Apply Filters
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
        
        {/* Desktop filters */}
        <div className="hidden md:flex md:w-1/5">
          <div className="bg-white rounded-xl shadow-sm border border-border/30 p-5 w-full sticky top-24 h-fit">
            <div className="space-y-6">
              <div>
                <h3 className="text-sm font-medium mb-3">Sort By</h3>
                <Select 
                  value={sortBy} 
                  onValueChange={handleSortChange}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map(option => (
                      <SelectItem key={option.id} value={option.id}>
                        {option.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div>
                <h3 className="text-sm font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    defaultValue={[0, 500]}
                    min={0}
                    max={500}
                    step={10}
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={handlePriceRangeChange}
                    className="mb-3"
                  />
                  <div className="flex justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="available"
                  checked={showOnlyAvailable}
                  onCheckedChange={(checked) => handleAvailabilityChange(!!checked)}
                />
                <Label htmlFor="available">Show only available today</Label>
              </div>
              
              <Button
                variant="outline"
                className="w-full"
                onClick={handleClearFilters}
              >
                Reset All Filters
              </Button>
            </div>
          </div>
        </div>
        
        {/* Results list moves to the right */}
        <div className="hidden md:block md:w-4/5 md:pl-6">
          {/* The actual search results will be rendered by the parent FindDoctors component */}
        </div>
      </div>
    </>
  );
};
