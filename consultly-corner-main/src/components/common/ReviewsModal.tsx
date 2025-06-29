
import React from 'react';
import { X, Star } from 'lucide-react';
import { PatientReview, ReviewType } from './PatientReview';

interface ReviewsModalProps {
  isOpen: boolean;
  onClose: () => void;
  doctorName: string;
  doctorRating: number;
  reviewCount: number;
  reviews: ReviewType[];
}

export const ReviewsModal: React.FC<ReviewsModalProps> = ({
  isOpen,
  onClose,
  doctorName,
  doctorRating,
  reviewCount,
  reviews
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}></div>
      
      <div 
        className="relative bg-card w-full max-w-3xl max-h-[80vh] rounded-2xl shadow-xl overflow-hidden flex flex-col animate-slide-up"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border sticky top-0 bg-background/95 backdrop-blur-sm z-10">
          <h2 className="font-bold text-xl">Patient Reviews for Dr. {doctorName}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-accent focus:outline-none focus:ring-1 focus:ring-primary transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Summary */}
        <div className="p-6 border-b border-border bg-accent/10">
          <div className="flex items-center">
            <div className="text-4xl font-bold mr-6">{doctorRating.toFixed(1)}</div>
            <div>
              <div className="flex text-yellow-500 mb-1">
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} size={20} className={i < Math.floor(doctorRating) ? "fill-current" : ""} />
                ))}
              </div>
              <div className="text-sm text-muted-foreground">Based on {reviewCount} reviews</div>
            </div>
          </div>
        </div>
        
        {/* Reviews List */}
        <div className="flex-1 overflow-y-auto p-6">
          {reviews.length > 0 ? (
            <div className="space-y-6">
              {reviews.map(review => (
                <PatientReview key={review.id} review={review} />
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              <p>No reviews available for this doctor yet.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
