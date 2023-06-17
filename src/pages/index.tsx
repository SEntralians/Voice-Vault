import { type NextPage } from "next";
import { signIn, signOut, useSession } from "next-auth/react";
import { Fragment, useState, useEffect } from "react";
import { api } from "~/utils/api";
import Vivi from "~/components/Vivi";
import Navbar from "~/components/navbar/Navbar";
import { Dialog, Transition } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";

const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const [title, setTitle] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [journalText, setJournalText] = useState("");
  const [journalWrite, setJounralWrite] = useState(false);
  const [greeted, setGreeted] = useState(false);
  const userImage = sessionData?.user.image ?? "images/logo_opaque.svg";

  const { mutate: addJournal } = api.journal.createJournal.useMutation({
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
    console.log(sessionData);
    if (sessionData && sessionData.user.name) {
      const name = sessionData.user.name.split(" ")[0] ?? "user";
      setMessage(
        `Hey ${name}! How was your day? Did something interesting happen today? Tell me what's on your mind!`
      );
    }
  }, [sessionData]);

  return (
    <>
      {sessionData ? (
        <div className="absolute top-0 h-screen w-screen bg-gray-900">
          <Navbar userImage={userImage} currentPage="home" />
          <div className="relative left-48 top-28 h-1/4 w-3/5">
            <h1 className="text-5xl font-bold text-white"> {message} </h1>
          </div>
          <div className="relative left-48 top-28 h-1/4 w-3/5">
            <h1 className="text-3xl text-white"> {journalText} </h1>
          </div>
          {journalText.length > 0 && (
            <div className="relative left-48 top-28 h-1/4 w-3/5">
              <button
                className="absolute bottom-10 z-30 h-32 w-32 cursor-pointer rounded-lg bg-white p-0 text-3xl"
                onClick={handleOpenModal}
              >
                Save as Journal?
              </button>
            </div>
          )}
          <Transition.Root show={isModalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="fixed inset-0 z-50 overflow-y-auto"
              onClose={() => setIsModalOpen(false)}
            >
              <div className="z-50 flex min-h-screen items-center justify-center">
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
                    <p>{journalText}</p>
                  </div>

                  <div className="flex justify-end">
                    <button
                      className="mr-2 rounded bg-gray-200 px-4 py-2 hover:bg-gray-300"
                      onClick={() => setIsModalOpen(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className="rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
                      onClick={handleCreateJournal}
                    >
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
