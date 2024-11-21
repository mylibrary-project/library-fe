import axios from "axios";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { deleteBook } from "../../redux/bookSlice";

export default function Home() {
  const books = useSelector((state) => state.book.books);
  const dispatch = useDispatch();

  const handleDeleteBook = async (id) => {
    try {
      await axios.delete(`http://localhost:8080/api/books/${id}`, {
        timeout: 5000,
      });
      dispatch(deleteBook(id));
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.error("요청시간 초과");
      }
      if (error.response.status === 404) {
        console.log(error.response.data);
      }
      console.error(error.message);
    }
  };

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        책 목록
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {books.map((book) => (
          <div
            key={book.id}
            className="bg-white p-4 rounded-lg shadow-md flex flex-col justify-between"
          >
            <Link to={`/detail/${book.id}`} className="flex justify-center">
              <img
                src={book.imgsrc}
                alt={book.title}
                className="max-h-40 mb-4"
              />
            </Link>
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-2">{book.title}</h2>{" "}
              <p className="text-gray-600">{book.author}</p>{" "}
            </div>
            <div className="flex mt-4 space-x-4">
              <Link
                to={`/update/${book.id}`}
                className="text-blue-500 hover:text-blue-700 bg-blue-100 p-2 rounded-md"
              >
                🖋️
              </Link>
              <button
                onClick={() => handleDeleteBook(book.id)}
                className="text-red-500 hover:text-red-700 bg-red-100 p-2 rounded-md"
              >
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
