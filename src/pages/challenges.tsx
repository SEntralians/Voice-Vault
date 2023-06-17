import React from "react";
import Navbar from "~/components/navbar/Navbar";
import Challenge from "~/components/challenges/challenge";
import Leaderboards from "~/components/challenges/leaderboards";
import Badges from "~/components/challenges/badges";

const ChallengesPage: React.FC = () => {
  return (
    <div className='max-w-screen min-h-screen bg-background-100'>
      <Navbar currentPage="challenges"/>
      <div className="max-w-full min-h-full flex flex-row-reverse">
        <div className="max-w-500 bg-background-100 min-h-full flex flex-col">
          <div className="w-full px-10 h-auto">
            
            <Leaderboards />

          </div>
          <div className="w-full px-10 h-auto">
            <Badges />
          </div>
        </div>
        <div className='w-full flex flex-col'>
          <Challenge />

        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
