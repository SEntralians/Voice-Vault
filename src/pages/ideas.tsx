import React, { useState } from "react";
import { api } from "~/utils/api";
import { withAuth } from "~/middlewares";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import Navbar from "~/components/navbar/Navbar";
import { useJournalStore } from "~/stores/journal";
import { useRouter } from "next/router";
import { Loader } from "~/components/loaders";

import type { RouterOutputs } from "~/utils/api";

type Journals = RouterOutputs["journal"]["search"];

const IdeasPage: React.FC = () => {
  const router = useRouter();
  const [journals, setJournals] = useState<Journals>([]);
  const [search, setSearch] = useState<string>("");

  const { mutate: searchJournals, isLoading: isLoadingSearch } =
    api.journal.search.useMutation({
      onSuccess: (journals) => {
        setJournals(journals);
      },
    });

  const setJournalId = useJournalStore((state) => state.setId);

  const handleSearch = () => {
    searchJournals({
      query: search,
    });
  };

  const goToJournal = (journalId: string) => {
    setJournalId(journalId);
    void router.push("/mind-dump");
  };

  const truncateDescription = (description: string, maxLength: number) => {
    if (description.length > maxLength) {
      return description.substring(0, maxLength) + "...";
    }
    return description;
  };

  return (
    <>
      <Navbar currentPage="Sticky Notes" />
      {journals && (
        <div className="container mx-auto px-4 py-20">
          <h1 className="mb-4 text-center text-3xl font-bold text-black">
            Ideas Search
          </h1>
          <div className="mb-4">
            <div className="flex items-center">
              <input
                className="mr-2 w-full rounded-lg border p-2 focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Search..."
                maxLength={700}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button
                className="flex flex-row gap-2 rounded bg-primary-400 px-4 py-2 font-bold text-white hover:opacity-50"
                onClick={handleSearch}
              >
                {isLoadingSearch ?? <Loader />}
                <MagnifyingGlassIcon className="h-5 w-5 text-white" />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            {!isLoadingSearch &&
              journals.map((journal) => (
                <div
                  key={journal.id}
                  onClick={() => goToJournal(journal.id)}
                  className="flex cursor-pointer flex-col space-y-2 overflow-y-auto rounded bg-primary-300 p-4 hover:opacity-80"
                >
                  <div className="flex flex-row gap-1">
                    <p className="text-sm">
                      {journal.createdAt.toDateString()}
                    </p>
                    <span>•</span>
                    <p className="text-sm">{journal.title}</p>
                  </div>
                  <p className="text-sm">
                    {truncateDescription(journal.description, 100)}
                  </p>
                </div>
              ))}

            {isLoadingSearch && (
              <div role="status" className="animate-pulse">
                <div className="mb-4 h-20 w-full rounded dark:bg-gray-300"></div>
                <div className="mb-4 h-20 w-full rounded dark:bg-gray-300"></div>
                <div className="mb-4 h-20 w-full rounded dark:bg-gray-300"></div>
              </div>
            )}
            {!isLoadingSearch && journals.length === 0 && (
              <div className="mt-52 flex flex-col items-center justify-center space-y-2">
                <p className="text-xl font-bold">No journals found</p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default withAuth(IdeasPage);
