import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

export default function Category() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryName = searchParams.get("category");

  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const handleDeleteBook = async (bookId) => {
    try {
      await axios.delete(`/api/books/${bookId}`);
      // 삭제 후 books 상태 재로딩
      fetchBooks();
    } catch (err) {
      console.error("책 삭제 중 오류 발생:", err);
    }
  };

  const fetchBooks = async () => {
    try {
      setLoading(true);

      const categoryResponse = await axios.get(
        `http://localhost:8080/api/categories?name=${categoryName}`
      );

      const category = categoryResponse.data[0];

      if (category) {
        const booksResponse = await axios.get(
          `http://localhost:8080/api/books?categoryId=${category.id}`
        );
        setBooks(booksResponse.data);
      } else {
        setBooks([]);
      }
      setLoading(false);
    } catch (error) {
      console.error(
        "Error fetching books:",
        error.response ? error.response.data : error.message
      );
      setError(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (categoryName) {
      fetchBooks();
    }
  }, [categoryName]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading books: {error.message}</div>;

  return (
    <div className="p-5 bg-gray-100 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
        {categoryName} 카테고리 책 목록
      </h1>
      {books.length === 0 ? (
        <div className="text-center text-gray-600">
          해당 카테고리에 책이 없습니다.
        </div>
      ) : (
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
                <h2 className="text-lg font-semibold mb-2">{book.title}</h2>
                <p className="text-gray-600">{book.author}</p>
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
      )}
    </div>
  );
}
