import React from "react";
import Navbar from "~/components/navbar/Navbar";
import Challenge from "~/components/challenges/challenge";

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
    <div className="max-w-screen min-h-screen">
      <Navbar currentPage="challenges" />
      <div className="flex min-h-full max-w-full flex-row-reverse">
        <div className="max-w-500 min-h-full bg-white">
          Lorem ipsum dolor sit, amet consectetur adipisicing e
        </div>
        <div className="flex w-full flex-col">
          <Challenge />
        </div>
      </div>
    </div>
  );
};

export default ChallengesPage;
