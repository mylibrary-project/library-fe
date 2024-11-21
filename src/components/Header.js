import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Header() {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);

  const categoryNameMapping = {
    sci: "과학",
    tech: "기술",
    lang: "언어",
    novel: "소설",
  };

  const toggleCategories = () => {
    setIsCategoryOpen(!isCategoryOpen);
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/categories"
        );
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="space-y-8 mt-10">
      <h1 className="text-3xl md:text-4xl font-bold">상품 관리</h1>
      <nav className="flex flex-col space-y-4 text-lg items-start">
        <Link
          to="/"
          className="hover:underline hover:text-gray-300 transition duration-200 text-blue-500 text-sm"
        >
          상품리스트
        </Link>
        <span
          onClick={toggleCategories}
          className="cursor-pointer text-red-500 hover:text-red-700 transition duration-200 text-sm"
        >
          {isCategoryOpen ? "▽ 상품카테고리" : "▷ 상품카테고리"}
        </span>
        {isCategoryOpen && (
          <div className="pl-4 space-y-2 flex flex-col">
            {categories.map((category) => (
              <Link
                to={{
                  pathname: "/category",
                  search: `?category=${category.name}`,
                }}
                className="hover:underline hover:text-gray-300 transition duration-200 text-sm"
              >
                ☞ {categoryNameMapping[category.name] || category.name}&nbsp; (
                {category.bookCount})
              </Link>
            ))}
          </div>
        )}
        <Link
          to="/add"
          className="hover:underline hover:text-gray-300 transition duration-200 text-green-500 text-sm"
        >
          상품추가
        </Link>
      </nav>
    </div>
  );
}
