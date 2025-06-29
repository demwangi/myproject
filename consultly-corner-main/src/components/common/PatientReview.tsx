
import React from 'react';
import { Star, ThumbsUp, ThumbsDown } from 'lucide-react';
import { Avatar } from '@/components/ui/avatar';

export interface ReviewType {
  id: string;
  patientName: string;
  patientAvatar?: string;
  rating: number;
  date: string;
  content: string;
  helpful: number;
  notHelpful: number;
}

interface PatientReviewProps {
  review: ReviewType;
}

export const PatientReview: React.FC<PatientReviewProps> = ({ review }) => {
  return (
    <div className="border-b border-border/50 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <div className="flex items-center mb-2">
        <Avatar className="h-10 w-10 mr-3">
          {review.patientAvatar ? (
            <img src={review.patientAvatar} alt={review.patientName} className="object-cover" />
          ) : (
            <div className="bg-primary/20 h-full w-full flex items-center justify-center text-primary font-medium">
              {review.patientName.charAt(0)}
            </div>
          )}
        </Avatar>
        <div>
          <h4 className="font-medium">{review.patientName}</h4>
          <div className="flex items-center text-xs text-muted-foreground">
            <div className="flex text-yellow-500 mr-1">
              {Array(5).fill(0).map((_, i) => (
                <Star 
                  key={i} 
                  size={12} 
                  className={i < review.rating ? "fill-current" : ""} 
                />
              ))}
            </div>
            <span>{review.date}</span>
          </div>
        </div>
      </div>
      
      <p className="text-sm text-foreground mb-3">{review.content}</p>
      
      <div className="flex items-center text-xs text-muted-foreground">
        <button className="flex items-center mr-4 hover:text-foreground">
          <ThumbsUp size={14} className="mr-1" />
          <span>Helpful ({review.helpful})</span>
        </button>
        <button className="flex items-center hover:text-foreground">
          <ThumbsDown size={14} className="mr-1" />
          <span>Not helpful ({review.notHelpful})</span>
        </button>
      </div>
    </div>
  );
};
