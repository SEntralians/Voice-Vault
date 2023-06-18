import { api } from "~/utils/api";
import { Loader } from "~/components/loaders";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/router";

interface DonePageProps {
  chatId: string;
  userId: string;
}

const DonePage: React.FC<DonePageProps> = ({ chatId, userId }) => {
  const router = useRouter();

  const { mutate: checkAnalysis, isLoading: isCheckingAnalysis } =
    api.analysis.createAnalysis.useMutation({
      onSuccess: async (result) => {
        if (result === "DONE") {
          await router.push(`/analysis/${chatId}`);
          return;
        }
        toast.success("Analysis created!");
        await router.push(`/analysis/${chatId}`);
        return;
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
        <h1 className="mt-10 text-center text-3xl font-bold text-black">
          The debate is done, that was a great discussion!
        </h1>

        <button
          className="mt-5 flex flex-row gap-2 rounded bg-primary-100 px-4 py-2 text-white hover:bg-primary-400"
          onClick={handleCheckAnalysis}
        >
          {isCheckingAnalysis ? <Loader /> : null}
          Click here to view the discussion again
        </button>
      </div>
      <Toaster />
    </>
  );
};

export default DonePage;
