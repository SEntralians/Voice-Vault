import React from "react";
import dayjs from "dayjs";
import { BookmarkSquareIcon } from "@heroicons/react/24/solid";

const data = [
  {
    title: "Lorem Ipsum 1",
    createdAt: new Date("2023-06-12"),
  },
  {
    title: "Lorem Ipsum 2",
    createdAt: new Date("2023-06-11"),
  },
  {
    title: "Lorem Ipsum 3",
    createdAt: new Date("2023-07-12"),
  },
  {
    title: "Lorem Ipsum 4",
    createdAt: new Date("2023-08-11"),
  },
  {
    title: "Lorem Ipsum 1",
    createdAt: new Date("2023-06-12"),
  },
  {
    title: "Lorem Ipsum 2",
    createdAt: new Date("2023-06-11"),
  },
  {
    title: "Lorem Ipsum 3",
    createdAt: new Date("2023-07-12"),
  },
  {
    title: "Lorem Ipsum 4",
    createdAt: new Date("2023-08-11"),
  },
  {
    title: "Lorem Ipsum 1",
    createdAt: new Date("2023-06-12"),
  },
  {
    title: "Lorem Ipsum 2",
    createdAt: new Date("2023-06-11"),
  },
  {
    title: "Lorem Ipsum 3",
    createdAt: new Date("2023-07-12"),
  },
  {
    title: "Lorem Ipsum 4",
    createdAt: new Date("2023-08-11"),
  },
];

const MyPage = () => {
  return (
    <div className="flex text-white">
      {/* Left Side */}
      <div className="my-10 max-h-screen w-3/12 overflow-y-scroll">
        {data.map((item) => (
          <div
            key={item.createdAt.toISOString()}
            className="mx-5 my-5 cursor-pointer border-b border-gray-800 bg-primary-200 p-4"
          >
            <div className="text-lg font-bold">
              {dayjs(item.createdAt).format("MMMM DD, YYYY")}
            </div>
            <div className="mt-2">
              {item.title.length > 30
                ? `${item.title.slice(0, 30)}...`
                : item.title}
            </div>
          </div>
        ))}
      </div>

      {/* Right Side */}
      <div className="my-20 w-9/12 p-8">
        <h1 className="mb-4 text-4xl font-bold">Article Title</h1>
        <div className="mb-4 flex flex-row items-start gap-5">
          <BookmarkSquareIcon className="mr-2 h-36 w-36 text-white" />
          <p className="mb-4">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti
            inventore nam quas expedita at tempora reiciendis rerum, aspernatur
            quia accusamus aperiam, voluptates, obcaecati vitae facilis aut
            quisquam incidunt id quae. Lorem ipsum, dolor sit amet consectetur
            adipisicing elit. Corrupti inventore nam quas expedita at tempora
            reiciendis rerum, aspernatur quia accusamus aperiam, voluptates,
            obcaecati vitae facilis aut quisquam incidunt id quae. Lorem ipsum,
            dolor sit amet consectetur adipisicing elit. Corrupti inventore nam
            quas expedita at tempora reiciendis rerum, aspernatur quia accusamus
            aperiam, voluptates, obcaecati vitae facilis aut quisquam incidunt
            id quae.
          </p>
        </div>

        <p className="mt-20 font-bold">Summary:</p>
        <div className="mt-5 bg-primary-200 px-5 py-3">
          <ul className="ml-4 mt-2 list-disc ">
            <li>Bullet point 1</li>
            <li>Bullet point 2</li>
            <li>Bullet point 3</li>
            {/* Add more bullet points as needed */}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MyPage;
