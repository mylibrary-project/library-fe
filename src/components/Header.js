import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import apiClient from "../api/api";
import errorDisplay from "../api/errorDisplay";
import { clearUserInfo, logout } from "../redux/userSlice";

export default function Header({ refreshCategories, resetCategoryRefresh }) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const role = useSelector((state) => state.user.role);
  const userInfo = useSelector((state) => state.user.isLoggedIn);
  const dispatch = useDispatch();
  const nav = useNavigate();

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
        const response = await apiClient.get("/api/categories");
        setCategories(response.data);
        if (refreshCategories) {
          resetCategoryRefresh();
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, [refreshCategories]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) {
      return;
    }
    try {
      const response = await apiClient.get(
        `/api/books/search-book/title?title=${searchTerm}`
      );
      nav("/search-result", { state: { results: response.data, searchTerm } });
      setSearchTerm("");
    } catch (error) {
      errorDisplay(error);
    }
  };

  const handleLogout = async (e) => {
    dispatch(logout());
    dispatch(clearUserInfo());
    alert("로그아웃 되었습니다.");
    nav("/");
  };

  return (
    <div className="space-y-8 mt-10">
      <h1 className="text-3xl md:text-4xl font-bold">상품 관리</h1>
      <form onSubmit={handleSearch} className="flex gap-1">
        <input
          type="text"
          name="title"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="text-black"
          placeholder="책 제목을 입력하세요"
        />
        <button type="submit" className="border-yellow-300">
          검색
        </button>
      </form>
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
                key={category.id}
              >
                ☞ {categoryNameMapping[category.name] || category.name}&nbsp; (
                {category.bookCount})
              </Link>
            ))}
          </div>
        )}
        {role === "ROLE_ADMIN" && (
          <Link
            to="/add"
            className="hover:underline hover:text-gray-300 transition duration-200 text-green-500 text-sm"
          >
            상품추가
          </Link>
        )}
        {!userInfo ? (
          <Link
            to="/join"
            className="hover:underline hover:text-gray-300 transition duration-200 text-sm"
          >
            회원가입
          </Link>
        ) : (
          <></>
        )}
        {!userInfo ? (
          <Link
            to="/login"
            className="hover:underline hover:text-gray-300 transition duration-200 text-sm"
          >
            로그인
          </Link>
        ) : (
          <button
            onClick={handleLogout}
            className="hover:underline hover:text-gray-300 transition duration-200 text-sm"
          >
            로그아웃
          </button>
        )}
      </nav>
    </div>
  );
}
