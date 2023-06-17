import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { api } from "~/utils/api";
import Vivi from "~/components/Vivi";
import Navbar from "~/components/navbar/Navbar";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const [message, setMessage] = useState('')
  const [journalText, setJournalText] = useState('')
  const [journalWrite, setJounralWrite] = useState(false)
  const [greeted, setGreeted ] = useState(false)

  function saveJournal(textEntry: string) : void {
    // create new journal entry and save to database
  }

  useEffect(() => {
    console.log(sessionData)
    if (sessionData && sessionData.user.name) {
      let name = ``
      for (let i = 0; i < sessionData.user.name.length; i++) {
        if (i > 0 && sessionData.user.name[i] === ` `) {
          break
        }
        name += sessionData.user.name[i]
      }
      setMessage(`Hey ${name}! How was your day? Did something interesting happen today? Tell me what's on your mind!`)
    }
  }, [sessionData])

  return (
    <>
      {sessionData ?
        <div className="h-screen w-screen bg-gray-900 absolute top-0">
          <Navbar currentPage="home" />
          <div className="h-1/4 w-3/5 relative top-28 left-48">
            <h1 className="text-white text-5xl font-bold"> {message} </h1>
          </div>
          <div className="h-1/4 w-3/5 relative top-28 left-48">
            <h1 className="text-white text-3xl"> {journalText} </h1>
          </div>
          {journalText.length > 0 &&
            <div className="h-1/4 w-3/5 relative top-28 left-48">
              <button className="absolute bottom-10 h-32 w-32 rounded-lg bg-white p-0 text-3xl" onClick={() => saveJournal(journalText)}> Save as Journal? </button>
            </div>
          }
          <Vivi message={message} greeted={greeted} setGreeted={setGreeted} setJournalWrite={setJounralWrite} journalWrite={journalWrite} setJournalText={setJournalText} journalText={journalText}/>
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
