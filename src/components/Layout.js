import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import apiClient from "../api/api";
import errorDisplay from "../api/errorDisplay";
import { addBook, setBooks } from "../redux/bookSlice";
import Header from "./Header";

export default function Layout() {
  const dispatch = useDispatch();

  const [refreshCategories, setRefreshCategories] = useState(false);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const triggerCategoryRefresh = () => {
    setRefreshCategories(true);
  };

  const resetCategoryRefresh = () => {
    setRefreshCategories(false);
  };

  const fetchBooks = async (pageNumber = 0) => {
    try {
      const url = `/api/books/paged?pageNo=${pageNumber}&size=8`;
      // console.log("Requesting URL:", url);
      const response = await apiClient.get(url);
      // console.log("Fetch Books Response:", response.data);
      dispatch(setBooks(response.data.content));
      setPage(response.data.pageNo);
      setTotalPages(response.data.totalPages);
    } catch (error) {
      errorDisplay(error);
    }
  };

  useEffect(() => {
    fetchBooks(page);
  }, [page]);

  const handleNextPage = () => {
    if (page < totalPages - 1) setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 0) setPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-5 fixed h-full">
        <Header
          refreshCategories={refreshCategories}
          resetCategoryRefresh={resetCategoryRefresh}
        />
      </aside>
      <main className="flex-grow ml-64 p-5">
        <Outlet context={{ triggerCategoryRefresh }} />
        <div className="fixed bottom-14 left-64 right-0 bg-white py-4 shadow-md flex justify-center space-x-2">
          <button
            onClick={handlePreviousPage}
            disabled={page === 0}
            className="px-4 py-2 bg-gray-200 rounded"
          >
            이전
          </button>
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              onClick={() => setPage(index)}
              className={`px-3 py-2 rounded ${
                index === page ? "bg-blue-500 text-white" : "bg-gray-200"
              }`}
            >
              {index + 1}
            </button>
          ))}
          <button
            onClick={handleNextPage}
            disabled={page === totalPages - 1}
            className="ml-4 px-4 py-2 bg-gray-200 rounded"
          >
            다음
          </button>
        </div>
      </main>
    </div>
  );
}
