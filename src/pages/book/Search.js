import React from "react";
import { useLocation, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import bookApi from "../../api/api";
import { deleteBook } from "../../redux/bookSlice";
import apiClient from "../../api/api";

export default function Search() {
  const location = useLocation();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user.role);
  const { results = [], searchTerm = "" } = location.state || {};

  const handleDeleteBook = async (id) => {
    try {
      await apiClient.delete(`/api/books/${id}`, {
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
        "{searchTerm}" 검색 결과 ({results.length}개)
      </h1>
      {results.length === 0 ? (
        <p className="text-center text-gray-600">검색 결과가 없습니다.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
          {results.map((book) => (
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
                <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
              </div>
              {role === "ROLE_ADMIN" && (
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
              )}
              <button className="text-green-500 hover:text-green-700 bg-red-100 p-2 rounded-md">
                대여
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
