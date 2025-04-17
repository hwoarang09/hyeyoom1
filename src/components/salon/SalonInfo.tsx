import React from 'react';
import { Button } from '@/components/ui/button';

interface SalonInfoProps {
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  status: 'open' | 'closed';
  openingTime?: string;
}

const SalonInfo: React.FC<SalonInfoProps> = ({
  name,
  location,
  rating,
  reviewCount,
  status,
  openingTime
}) => {
  return (
    <div className="px-4 py-5">
      <h1 className="text-2xl font-bold mb-2">{name}</h1>
      
      <div className="flex items-center mb-2">
        <div className="flex items-center">
          <span className="text-lg font-semibold mr-1">{rating.toFixed(1)}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <svg 
                key={i} 
                xmlns="http://www.w3.org/2000/svg" 
                viewBox="0 0 24 24" 
                fill="currentColor" 
                className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-500' : 'text-gray-300'}`}
              >
                <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" clipRule="evenodd" />
              </svg>
            ))}
          </div>
        </div>
        <span className="text-gray-500 ml-2">({reviewCount.toLocaleString()})</span>
      </div>
      
      <p className="text-gray-600 mb-2">{location}</p>
      
      <div className="mb-4">
        <span className={`font-medium ${status === 'open' ? 'text-green-600' : 'text-red-600'}`}>
          {status === 'open' ? 'Open' : 'Closed'}
        </span>
        {status === 'closed' && openingTime && (
          <span className="text-gray-600"> - opens on {openingTime}</span>
        )}
      </div>
      
      <div className="flex gap-2">
        <Button variant="outline" className="rounded-full px-4 py-1 h-auto text-sm">
          Featured
        </Button>
        <Button variant="outline" className="rounded-full px-4 py-1 h-auto text-sm text-green-600 border-green-200 bg-green-50">
          Deals
        </Button>
      </div>
    </div>
  );
};

export default SalonInfo;
