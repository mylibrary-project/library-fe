import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Outlet } from "react-router-dom";
import apiClient from "../api/api";
import errorDisplay from "../api/errorDisplay";
import { addBook } from "../redux/bookSlice";
import Header from "./Header";

export default function Layout() {
  const dispatch = useDispatch();

  const [refreshCategories, setRefreshCategories] = useState(false);

  const triggerCategoryRefresh = () => {
    setRefreshCategories(true);
  };

  const resetCategoryRefresh = () => {
    setRefreshCategories(false);
  };

  useEffect(() => {
    apiClient
      .get("/api/books")
      .then((response) => {
        response.data.map((t) => dispatch(addBook(t)));
      })
      .catch((error) => {
        errorDisplay(error);
      });
  }, [dispatch]);

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
      </main>
    </div>
  );
}
