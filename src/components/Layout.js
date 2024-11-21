import React, { useEffect } from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addBook } from "../redux/bookSlice";

export default function Layout() {
  const dispatch = useDispatch();

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/books", { timeout: 5000 })
      .then((response) => {
        response.data.map((t) => dispatch(addBook(t)));
      })
      .catch((error) => {
        if (error.code === "ECONNABORTED") {
          console.log("요청시간초과");
        } else if (error.response) {
          console.log("서버 에러");
          console.log(error.response.status);
          console.log(error.response.data);
        } else if (error.request) {
          console.log("요청 패킷 에러", error.message);
        } else {
          console.log("에러 발생", error.message);
        }
      });
  }, [dispatch]);

  return (
    <div className="min-h-screen flex">
      <aside className="w-64 bg-gray-900 text-white p-5 fixed h-full">
        <Header />
      </aside>
      <main className="flex-grow ml-64 p-5">
        <Outlet />
      </main>
    </div>
  );
}
