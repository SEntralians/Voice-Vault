import { api } from "~/utils/api";
import toast, { Toaster } from "react-hot-toast";

interface DonePageProps {
  chatId: string;
  userId: string;
}

const DonePage: React.FC<DonePageProps> = ({ chatId, userId }) => {
  const { mutate: checkAnalysis } = api.analysis.createAnalysis.useMutation({
    onSuccess: () => {
      toast.success("Analysis created!");
    },
    onError: (e) => {
      toast.error(e.message);
    },
  });
  const handleCheckAnalysis = () => {
    checkAnalysis({
      chatId,
      userId,
    });
  };
  return (
    <>
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="mt-10 text-center text-3xl text-white">
          That was a great discussion!
        </h1>
        <button
          className="mt-5 rounded bg-blue-500 px-4 py-2 text-white hover:bg-blue-600"
          onClick={handleCheckAnalysis}
        >
          Click here to view the discussion again
        </button>
      </div>
      <Toaster />
    </>
  );
};

export default DonePage;
