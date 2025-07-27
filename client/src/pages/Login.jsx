import React, { useState } from "react";
import { Lock, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const res = await axios.post("http://localhost:3000/login", {
      username,
      password,
    });

    if (res.status === 200 || res.status === 201) {
      const { token, role, userId, employee } = res.data;
      localStorage.setItem("token", token)
      localStorage.setItem("role", role)
      localStorage.setItem("userId", userId);
      localStorage.setItem("employeeId", employee);
      role === "admin"?navigate("/attendance/employees"):navigate("/attendance/EmployeeLeave")
    } else {
      alert("Invalid username or password");
    }
  } catch (error) {
    console.error("Login error:", error);
    if (error.response && error.response.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("An error occurred while logging in. Please try again.");
    }
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1627]">
      <div className="w-full max-w-md p-8 space-y-6 bg-[#1a2332] rounded-lg shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-white">Arkitek</h1>
          <p className="mt-2 text-gray-400">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-gray-300">
              Username
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <User className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="username"
                name="username"
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 bg-[#0e1627] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
                placeholder="Enter your username"
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-3 py-2  bg-[#0e1627] text-white rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 "
                placeholder="Enter your password"
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm">
              <a href="#" className="font-medium text-[#3fc6c1] hover:text-[#5eead4]">
                Forgot password?
              </a>
            </div>
          </div>

          <div>
            <button
              type="submit"
              style={{ borderRadius:"5px" }}
              className="w-full flex justify-center py-2 px-4 border-orange-600 rounded-md shadow-sm text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#3fc6c1]"
            >
              Log in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
