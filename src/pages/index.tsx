import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment, useState, useEffect } from "react";
import { api } from "~/utils/api";
import Vivi from "~/components/Vivi";
import Navbar from "~/components/navbar/Navbar";
import { Dialog, Transition } from "@headlessui/react";
import { Loader } from "~/components/loaders";
import toast, { Toaster } from "react-hot-toast";
import Image from 'next/image'

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [journalText, setJournalText] = useState("");
  const [journalWrite, setJounralWrite] = useState(false);
  const [greeted, setGreeted] = useState(false);

  const greeting = () => {
    const now = new Date();
    const hour = now.getHours();
    if (hour < 12) {
      return "morning";
    } else if (hour < 18) {
      return "afternoon";
    } else {
      return "evening";
    }
  };

  const { mutate: addJournal, isLoading: isAddingJournal } =
    api.journal.createJournal.useMutation({
      onSuccess: () => {
        setIsModalOpen(false);
        toast.success("Journal saved!");
      },
      onError: (error) => {
        toast.error(error.message);
      },
    });

  const handleCreateJournal = () => {
    if (!title || !journalText) {
      toast.error("Please fill in all fields");
      return;
    }
    addJournal({
      title,
      description: journalText,
    });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (sessionData && sessionData.user.name) {
      const name = sessionData.user.name.split(" ")[0] ?? "user";
      setMessage(
        `Hey ${name}! How was your ${greeting()}? Did something interesting happen today? Tell me what's on your mind!`
      );
    }
  }, [sessionData]);

  return (
    <>
      {sessionData ? (
        <div className="h-screen w-screen bg-background-100">
          <Navbar currentPage="home" />
          <div className="mx-32 mt-20">
            <h1 className="text text-6xl font-bold text-primary-200">
              {message}
            </h1>
          </div>
          <div className="mx-32 mt-10">
            <h1 className="font-serif text-3xl text-primary-100">
              {journalText}
            </h1>
          </div>
          {journalText.length > 0 && (
            <div className="">
              <button
                className="ml-32 mt-20 h-32 w-min cursor-pointer rounded-lg bg-secondary-100 p-0 px-7 font-serif text-3xl font-bold text-primary-100"
                onClick={handleOpenModal}
              >
                Save as Journal?
              </button>
            </div>
          )}
          <Transition.Root show={isModalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 overflow-y-auto"
              onClose={() => setIsModalOpen(false)}
            >
              <div className="flex min-h-screen items-center justify-center">
                <Dialog.Overlay className="fixed inset-0 -z-10 bg-black opacity-30" />

                <div className="w-1/2 rounded-lg bg-white p-8">
                  <Dialog.Title className="mb-4 text-2xl font-bold">
                    Save as Journal
                  </Dialog.Title>

                  <div className="my-4">
                    <h1 className="text-lg font-extrabold">Title</h1>
                    <input
                      className="w-full rounded border-2 border-gray-200 p-2"
                      placeholder="Title"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                    />
                  </div>

                  <div className="my-4">
                    <h1 className="text-lg font-extrabold">Content</h1>
                    <textarea
                      className="h-52 w-full rounded border-2 border-gray-200 p-2"
                      placeholder="Content"
                      value={journalText}
                      onChange={(e) => setJournalText(e.target.value)}
                    />
                  </div>

                  <div className="flex justify-end">
                    <button
                      className="mr-2 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="flex flex-row rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      onClick={handleCreateJournal}
                    >
                      {isAddingJournal && <Loader />}
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
          <Vivi
            message={message}
            greeted={greeted}
            setGreeted={setGreeted}
            setJournalWrite={setJounralWrite}
            journalWrite={journalWrite}
            setJournalText={setJournalText}
            journalText={journalText}
          />
        </div>
      ) : (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white">
          <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
            <div className="flex flex-col items-center gap-2">
              <AuthShowcase />
            </div>
          </div>
        </div>
      )}
      <Toaster />
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();
  const [ isRolling, setIsRolling ] = useState(false);

  const handleLogin = async () => {
    setIsRolling(true);
    sessionData ? () => void signOut() : () => void signIn()
    await signIn("google"); // Replace with your desired NextAuth provider
  };

  return (
    <div className="bg-secondary-100 h-screen w-screen flex items-center justify-center top-0 left-0 absolute">
      <div className={`flex justify-center mb-6 transform absolute ${
          isRolling ? "-translate-x-full -rotate-180" : ""
        } transition-transform duration-1000`}>
          <Image
            src="images/logo_opaque.svg" // Replace with the path to your logo image
            alt="Logo"
            className="rounded-full"
            width={600}
            height={600}
          />
      </div>

      <div
        className={`w-96 max-w-96 bg-white bg-opacity-80 p-8 mt-96 rounded-lg shadow-md z-50 items-center justify-center`}
      >
        <h2 className="text-5xl font-bold mb-4 mx-auto items-center justify-center text-center text-primary-200">VoiceVault</h2>
        <div className="flex justify-center">
          <button
            onClick={handleLogin}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md focus:outline-none"
          >
            {sessionData ? "Sign out" : "Sign in with Google"}
          </button>
        </div>
      </div>
    </div>
  );
  // return (
  //   <div className="flex flex-col items-center justify-center gap-4">
  //     <button
  //       className="rounded-full bg-black/10 px-10 py-3 font-semibold text-black no-underline transition hover:bg-black/20"
  //       onClick={sessionData ? () => void signOut() : () => void signIn()}
  //     >
  //       {sessionData ? "Sign out" : "Sign in"}
  //     </button>
  //   </div>
  // );
};
