import React, { useEffect, useState } from 'react';
import Navbar from '~/components/navbar/Navbar';
import Challenge from '~/components/challenges/challenge';

interface User {
  id: string;
  name: string;
  completedChallenges: string[];
}

interface LeaderboardUser {
  name: string;
  completedChallenges: number;
}

const ChallengesPage: React.FC = () => {

  return (
    <div className='max-w-screen min-h-screen'>
      <Navbar currentPage="challenges"/>
      <div className="max-w-full min-h-full flex flex-row-reverse">
        <div className="max-w-500 bg-white min-h-full">
          Lorem ipsum dolor sit, amet consectetur adipisicing e
        </div>
        <div className='w-full flex flex-col'>
          <Challenge />

        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
