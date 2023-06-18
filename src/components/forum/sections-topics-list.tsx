import React from 'react';

const Categories: React.FC = () => {
  return (
    <div className="flex flex-col bg-white px-4 py-6 max-w-sm mx-auto rounded-lg shadow-md">
      <ul className="">
        <li>
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- Anime</a>
        </li>
        <li className="mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- Debate</a>
        </li>
        <li className="mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- Funny</a>
        </li>
        <li className="mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- Life-Crisis</a>
        </li>
        <li className="flex items-center mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- Memes</a>
        </li>
        <li className="flex items-center mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- Shower Thoughts</a>
        </li>
        <li className="flex items-center mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">...</a>
        </li>
      </ul>
    </div>
  );
};

export default Categories;
