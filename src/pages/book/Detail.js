import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function Detail() {
  const { id } = useParams();
  const [book, setBook] = useState({});

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/books/${id}`
        );
        setBook(response.data);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book.imgsrc) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-5 bg-gray-100 min-h-screen flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full md:w-2/3 lg:w-1/2">
        <div className="flex justify-center mb-6">
          <img
            src={book.imgsrc}
            alt={book.title}
            className="max-h-80 object-cover rounded-lg"
          />
        </div>
        <h2 className="text-3xl font-bold mb-4 text-center">{book.title}</h2>
        <h3 className="text-xl font-semibold mb-2 text-center text-gray-700">
          {book.author}
        </h3>
        <p className="text-gray-600 mb-4">
          Category: {book.categoryName || "Unknown"}
        </p>
        <p className="text-gray-600 mb-4">{book.description}</p>
        <p className="text-gray-500">Published by: {book.publisher}</p>
      </div>
    </div>
  );
}
