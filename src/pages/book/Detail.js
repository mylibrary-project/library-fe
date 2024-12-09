import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useOutletContext, useParams } from "react-router-dom";
import apiClient from "../../api/api";
import errorDisplay from "../../api/errorDisplay";

export default function Detail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const { triggerCategoryRefresh } = useOutletContext();
  const isLoggedIn = useSelector((state) => state.user.isLoggedIn);
  const currentUser = useSelector((state) => state.user.currentUser);
  const rentList = useSelector((state) => state.user.userRentList);
  const [book, setBook] = useState({});
  const [isRented, setIsRented] = useState(false);

  const isBookInRentList = () => {
    if (!rentList || rentList.length === 0) {
      // console.log("Rent list is empty or undefined.");
      return false;
    }
    const flatRentList = rentList.flat();

    const result = flatRentList.some((rentItem) => {
      if (!rentItem || rentItem.bookId === undefined) {
        // console.log("Invalid rentItem:", rentItem);
        return false;
      }
      const isMatch = rentItem.bookId === parseInt(id);
      // console.log(
      //   `Checking rentItem.bookId (${rentItem.bookId}) === id (${parseInt(
      //     id
      //   )}):`,
      //   isMatch
      // );
      return isMatch;
    });

    // console.log("Final isBookInRentList result:", result);
    return result;
  };

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const response = await apiClient.get(`/api/books/${id}`);
        setBook(response.data);
        setIsRented(response.data.rented);
      } catch (error) {
        console.error("Failed to fetch book:", error);
      }
    };
    fetchBook();
  }, [id]);

  if (!book.imgsrc) {
    return <div>Loading...</div>;
  }

  const handleRentBook = async () => {
    try {
      const response = await apiClient.post(
        `/api/rents/rent?bookId=${id}&username=${currentUser}`
      );
      triggerCategoryRefresh();
      setIsRented(true);
      alert("대여에 성공하셨습니다.");
      nav("/");
    } catch (error) {
      alert("이미 대여된 책입니다.");
      errorDisplay(error);
    }
  };

  const handleExtendRental = async () => {
    try {
      const response = await apiClient.post(`/api/rents/extend?bookId=${id}`);
      const newEndDate = response.data.endDate;
      alert(
        `대여 기간이 연장되었습니다. ${new Date(
          newEndDate
        ).toLocaleDateString()}까지 반납해주세요.`
      );
      nav("/");
    } catch (error) {
      alert("더 이상 연장할 수 없습니다.");
      errorDisplay(error);
    }
  };

  const handleReturnBook = async () => {
    try {
      await apiClient.post(`/api/rents/return/${id}`);
      setIsRented(false);
      alert("책이 반납되었습니다.");
      nav("/");
    } catch (error) {
      errorDisplay(error);
    }
  };

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
        {isLoggedIn && (
          <div className="flex space-x-3 mt-4">
            {!isRented && (
              <button
                onClick={handleRentBook}
                className="flex-1 bg-blue-500 text-white hover:bg-blue-600 p-2 rounded-md flex items-center justify-center"
              >
                <span className="mr-2">📖</span>Rent
              </button>
            )}

            {isRented && isBookInRentList() && (
              <>
                <button
                  onClick={handleExtendRental}
                  className="flex-1 bg-green-500 text-white hover:bg-green-600 p-2 rounded-md flex items-center justify-center"
                >
                  <span className="mr-2">➕</span>Extend
                </button>
                <button
                  onClick={handleReturnBook}
                  className="flex-1 bg-purple-500 text-white hover:bg-purple-600 p-2 rounded-md flex items-center justify-center"
                >
                  <span className="mr-2">📘</span>Return
                </button>
              </>
            )}

            {isRented && !isBookInRentList() && (
              <div className="flex-1 bg-gray-300 text-gray-600 p-2 rounded-md flex items-center justify-center cursor-not-allowed">
                <span className="mr-2">📖</span>Rent Unavailable
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
