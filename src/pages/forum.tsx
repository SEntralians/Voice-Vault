import React from 'react';
import Navbar from "~/components/navbar";
import PostFilter from '~/components/forum/elements-select-option';
import Post from '~/components/forum/elements-discussion-post';
import Pagination from '~/components/forum/elements-page-options';
import Advertisement from '~/components/forum/sections-advertisement';
import Topics from '~/components/forum/sections-topics-list';
import SimpleFooter from '~/components/forum/navigation-footer-simple-with-icon';

interface PostData {
  id: number;
  date: string;
  tag: string;
  title: string;
  body: string;
  image: string;
  userName: string;
}

const App: React.FC = () => {
  const posts: PostData[] = [
    {
      id: 1,
      date: 'Jun 1, 2020',
      tag: 'Laravel',
      title: 'Build Your New Idea with Laravel Freamwork.',
      body:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      image:
        'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=731&q=80',
      userName: 'Alex John',
    },
    {
      id: 2,
      date: 'mar 4, 2019',
      tag: 'Design',
      title: 'Accessibility tools for designers and developers',
      body:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      image:
        'https://images.unsplash.com/photo-1464863979621-258859e62245?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=333&q=80',
      userName: 'Jane Doe',
    },
    {
      id: 3,
      date: 'Feb 14, 2019',
      tag: 'PHP',
      title: 'PHP: Array to Map',
      body:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      image:
        'https://images.unsplash.com/photo-1531251445707-1f000e1e87d0?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=281&q=80',
      userName: 'Lisa Way',
    },
    {
      id: 4,
      date: 'Dec 23, 2018',
      tag: 'Django',
      title: 'Django Dashboard - Learn by Coding',
      body:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      image:
        'https://images.unsplash.com/photo-1500757810556-5d600d9b737d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=735&q=80',
      userName: 'Steve Matt',
    },
    {
      id: 5,
      date: 'Mar 10, 2018',
      tag: 'Testing',
      title: 'TDD Frist',
      body:
        'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Tempora expedita dicta totam aspernatur doloremque. Excepturi iste iusto eos enim reprehenderit nisi, accusamus delectus nihil quis facere in modi ratione libero!',
      image:
        'https://images.unsplash.com/photo-1502980426475-b83966705988?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=373&q=80',
      userName: 'Khatab Wedaa',
    },
  ];

  return (
    <div id="app" className="font-roboto bg-gray-100">
      <Navbar currentPage={''} />
      <div className="px-6 py-8">
        <div className="flex justify-between container mx-auto">
          <div className="w-full lg:w-8/12">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-700 md:text-2xl">Post</h1>
              <PostFilter />
            </div>
            <div className="mt-6">
              {posts.map((post) => (
                <div className="mt-6" key={post.id}>
                  <Post data={post} />
                </div>
              ))}
            </div>
            <div className="mt-8">
              <Pagination />
            </div>
          </div>
          <div className="-mx-8 w-4/12 hidden lg:block">
            <div className="mt-10 px-8">
              <h1 className="mb-4 text-xl font-bold text-gray-700">Topics</h1>
              <Topics />
            </div>
            <div className="mt-10 px-8">
              <h1 className="mb-4 text-xl font-bold text-gray-700">Advertisement</h1>
              <Advertisement data={[]} />
            </div>
            <div className="mt-10 px-8">
              <div className="flex flex-col bg-white px-8 py-6 max-w-sm mx-auto rounded-lg shadow-md">
                <div className="flex justify-center items-center">
                  <a className="px-20 py-2 bg-gray-600 text-xl text-green-100 rounded hover:bg-gray-500" href="#">
                    Start Debate
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SimpleFooter />
    </div>
  );
};

export default App;
