import React from 'react';

interface AdvertisementProps {
  data: {
    name: string;
    avatar: string;
    postCount: number;
  }[];
}

const Advertisement: React.FC<AdvertisementProps> = ({ data }) => {
  return (
    <div className="flex flex-col bg-white max-w-sm px-6 py-4 mx-auto rounded-lg shadow-md">

    </div>
  );
};

export default Advertisement;
