/* eslint-disable react/jsx-key */
import React from 'react';
import challengeList from '~/utils/challengeList';

interface Challenge {
  id: string;
  duration: number;
  title: string;
  tag: string;
  description: string;
  points: number;
}

const Challenge: React.FC = () => {
  console.log(challengeList.length)
  const challenges: Array<Challenge> = challengeList

  return(
    <>
      {challenges.map((challenge) => {
        return (
        <div className="max-w-full px-8 py-4 mx-10 my-5 bg-white rounded-lg shadow-md dark:bg-gray-800">
          <div className="flex items-center justify-between">
            <span className="text-sm font-light text-gray-600 dark:text-gray-400">{challenge.duration} Days Left</span>
            <a className="px-3 py-1 text-sm font-bold text-gray-100 transition-colors duration-300 transform bg-gray-600 rounded cursor-pointer hover:bg-gray-500" role="button">{challenge.tag}</a>
          </div>

          <div className="mt-2">
            <a href="#" className="text-xl font-bold text-gray-700 dark:text-white hover:text-gray-600 dark:hover:text-gray-200 hover:underline" role="link">{challenge.title} - {challenge.points} points</a>
            <p className="mt-2 text-gray-600 dark:text-gray-300">{challenge.description}</p>
          </div>

          <div className="flex items-center justify-between mt-4">
            <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline" role="link">Read more</a>

            <div className="flex items-center">
              <a className="font-bold text-gray-700 cursor-pointer dark:text-gray-200" role="link">Accept Challenge</a>
            </div>
          </div>
        </div>
        )
      }
      )}
    </>
  )
};

export default Challenge;
