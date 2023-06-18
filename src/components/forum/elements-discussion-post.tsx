import React from 'react';

interface PostProps {
  data: {
    date: string;
    tag: string;
    title: string;
    body: string;
    image: string;
    userName: string;
  };
}

const Post: React.FC<PostProps> = ({ data }) => {
  return (
    <div className="max-w-4xl px-10 py-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center">
        <span className="font-light text-gray-600">{data.date}</span>
        <a className="px-2 py-1 bg-secondary-200 text-gray-100 font-bold rounded hover:bg-gray-500" href="#">
          {data.tag}
        </a>
      </div>
      <div className="mt-2">
        <a className="text-2xl text-primary-200 font-bold hover:underline" href="#">
          {data.title}
        </a>
        <p className="mt-2 text-gray-600">{data.body}</p>
      </div>
      <div className="flex justify-between items-center mt-4">
        <a className="text-primary-100 hover:underline" href="#">
          Read more
        </a>
        <div>
          <a className="flex items-center" href="#">
            <img
              className="mx-4 w-10 h-10 object-cover rounded-full hidden sm:block"
              src={data.image}
              alt="avatar"
            />
            <h1 className="text-gray-700 font-bold hover:underline">{data.userName}</h1>
          </a>
        </div>
      </div>
    </div>
  );
};

export default Post;
