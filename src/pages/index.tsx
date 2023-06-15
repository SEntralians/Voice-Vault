import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import Head from "next/head";
import { api } from "~/utils/api";
import Vivi from "~/components/Vivi";
import Navbar from "~/components/navbar/Navbar";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  console.log(sessionData);
  return (
    <>
      {sessionData ?
        <div className="h-screen w-screen bg-gray-900 absolute top-0">
          <Navbar currentPage="home" />
          <div className="h-1/4 w-3/5 relative top-28 left-48">
            <h1 className="text-white text-6xl font-bold"> {message} </h1>
          </div>
          <Vivi message={message} greeted={greeted} setGreeted={setGreeted}/>
        </div>
       :
       <div className="flex min-h-screen flex-col items-center justify-center bg-white">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <AuthShowcase />
          </div>
        </div>
      </div>
       }
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <button
        className="rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};
