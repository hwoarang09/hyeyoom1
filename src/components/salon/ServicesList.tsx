import React from 'react';

interface ServicesListProps {
  serviceCount: number;
}

const ServicesList: React.FC<ServicesListProps> = ({ serviceCount }) => {
  return (
    <div className="px-4 py-5 border-t border-gray-200">
      <h2 className="text-xl font-bold mb-4">Services</h2>
      <p className="text-gray-600">{serviceCount} services available</p>
    </div>
  );
};

export default ServicesList;
