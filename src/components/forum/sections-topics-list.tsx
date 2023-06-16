import React from 'react';

const Categories: React.FC = () => {
  return (
    <div className="flex flex-col bg-white px-4 py-6 max-w-sm mx-auto rounded-lg shadow-md">
      <ul className="">
        <li>
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- AWS</a>
        </li>
        <li className="mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- Laravel</a>
        </li>
        <li className="mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- Vue</a>
        </li>
        <li className="mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- Design</a>
        </li>
        <li className="flex items-center mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- Django</a>
        </li>
        <li className="flex items-center mt-2">
          <a className="text-gray-700 font-bold mx-1 hover:text-gray-600 hover:underline" href="#">- PHP</a>
        </li>
      </ul>
    </div>
  );
};

export default Categories;
