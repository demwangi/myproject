
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';
import { ReviewType } from '@/components/common/PatientReview';
import { formatDistanceToNow } from 'date-fns';

interface ReviewCardProps {
  review: ReviewType;
}

export const ReviewCard: React.FC<ReviewCardProps> = ({ review }) => {
  const { patientName, patientAvatar, rating, content, date } = review;
  
  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }).map((_, index) => (
      <Star 
        key={index} 
        className={`h-4 w-4 ${index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} 
      />
    ));
  };
  
  return (
    <Card className="shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start">
          <Avatar className="h-10 w-10 mr-3">
            <AvatarImage src={patientAvatar} alt={patientName} />
            <AvatarFallback>{patientName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">{patientName}</h4>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(date), { addSuffix: true })}
              </span>
            </div>
            <div className="flex mt-1 mb-2">
              {renderStars(rating)}
            </div>
            <p className="text-sm text-gray-600">{content}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
