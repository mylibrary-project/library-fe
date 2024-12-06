import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import apiClient from "../../api/api";
import errorDisplay from "../../api/errorDisplay";
import { login, saveJwtToken, setRole } from "../../redux/userSlice";

export default function Login() {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const role = useSelector((state) => state.user.role);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await apiClient.post(
        "/login",
        new URLSearchParams({ username: email, password: password }),
        {
          withCredentials: true,
        }
      );
      const token = response.headers["authorization"];
      await dispatch(login(email));
      console.log("토큰:" + token);
      await dispatch(saveJwtToken(token));
      await dispatch(setRole(response.data));
      alert("로그인 성공!!");
      nav("/");
    } catch (error) {
      errorDisplay(error);
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <input
          type="text"
          name="email"
          placeholder="아이디 입력하세요"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border rounded-md border-gray-300 w-full p-2 mb-4"
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호 입력하세요"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border rounded-md border-gray-300 w-full p-2 mb-4"
        />
        <button
          type="submit"
          className="bg-blue-500 rounded-md text-white w-full p-2 mt-4 hover:bg-blue-700"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
