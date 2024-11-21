import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { updateBook } from "../../redux/bookSlice";

export default function Update() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const nav = useNavigate();
  const book = useSelector((state) =>
    state.book.books.find((b) => b.id === parseInt(id))
  );
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState({
    title: "",
    author: "",
    description: "",
    publisher: "",
    categoryId: "",
  });

  const handleChange = (e) => {
    setInputValue((prevValues) => ({
      ...prevValues,
      [e.target.name]: e.target.value,
    }));
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories"
        );
        setCategories(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (book && !loading) {
      setInputValue(() => ({
        title: book.title,
        author: book.author,
        description: book.description,
        publisher: book.publisher,
        categoryId: book.categoryId ? book.categoryId.toString() : "",
      }));
    }
  }, [book, loading]);

  const onSubmitUpdate = async (e) => {
    e.preventDefault();
    const { title, author, description, publisher, categoryId } = inputValue;
    const data = {
      ...inputValue,
      id: parseInt(id),
      title: title,
      author: author,
      description: description,
      publisher: publisher,
      categoryId: Number(categoryId),
    };

    try {
      const response = await axios.put(
        `http://localhost:8080/api/books/${id}`,
        data,
        {
          headers: {
            "Content-Type": "application/json",
          },
          timeout: 5000,
        }
      );
      dispatch(updateBook(response.data));
    } catch (error) {
      if (error.code === "ECONNABORTED") {
        console.error("요청시간 초과");
      }
      console.error(error.message);
    }
    nav("/");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form
        onSubmit={onSubmitUpdate}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-5 text-center">책 추가</h2>

        <label htmlFor="title" className="block text-gray-700">
          책 제목 :
        </label>
        <input
          type="text"
          name="title"
          value={inputValue.title}
          onChange={handleChange}
          className="border rounded-md border-gray-300 w-full p-2 mb-4"
          placeholder="책 제목을 입력하세요"
        />

        <label htmlFor="author" className="block text-gray-700">
          책 저자 :
        </label>
        <input
          type="text"
          name="author"
          value={inputValue.author}
          onChange={handleChange}
          className="border rounded-md border-gray-300 w-full p-2 mb-4"
          placeholder="책 저자를 입력하세요"
        />

        <label htmlFor="description" className="block text-gray-700">
          책 설명 :
        </label>
        <input
          type="text"
          name="description"
          value={inputValue.description}
          onChange={handleChange}
          className="border rounded-md border-gray-300 w-full p-2 mb-4"
          placeholder="책 설명을 입력하세요"
        />

        <label htmlFor="publisher" className="block text-gray-700">
          출판사 :
        </label>
        <input
          type="text"
          name="publisher"
          value={inputValue.publisher}
          onChange={handleChange}
          className="border rounded-md border-gray-300 w-full p-2 mb-4"
          placeholder="출판사를 입력하세요"
        />

        <label htmlFor="categoryId" className="block text-gray-700">
          카테고리 :
        </label>
        <select
          name="categoryId"
          value={inputValue.categoryId}
          onChange={handleChange}
          className="border rounded-md border-gray-300 w-full p-2 mb-4"
        >
          <option value="">카테고리 선택</option>
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          className="bg-blue-500 rounded-md text-white w-full p-2 mt-4 hover:bg-blue-700"
          disabled={!inputValue.categoryId}
        >
          저장
        </button>
      </form>
    </div>
  );
}
