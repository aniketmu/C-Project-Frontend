import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import chat from "../chat.png";
import {
  changeUserName,
  changeUserEmail,
  changeUserId,
  changeUserImage,
} from "../store/actions.js";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";

const SignIn = () => {
  const [user, setUser] = useState({});
  const [emailError, setEmailError] = useState(""); // State for email error
  const [passwordError, setPasswordError] = useState(""); // State for password error
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEmailError(""); // Reset email error
    setPasswordError(""); // Reset password error

    try {
      const response = await fetch("https://c-project-backend.onrender.com/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.status === 401) {
        setPasswordError("The password entered is not correct");
      } else if (response.status === 404) {
        setEmailError("Email not found");
      } else if (response.status === 200) {
        const data = await response.json();
        console.log(data);

        dispatch(changeUserEmail(data.email));
        dispatch(changeUserName(data.name));
        dispatch(changeUserId(data.userId));
        dispatch(changeUserImage(data.image));

        Cookies.set("token", data.token, {
          secure: true,
          sameSite: "strict",
          httpOnly: true,
        });
        Cookies.set("userEmail", data.email);
        Cookies.set("userName", data.name);
        Cookies.set("userId", data.userId);
        Cookies.set("profileImage", data.profileImage);

        navigate("/dashboard");
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            className="mx-auto h-10 w-auto"
            src={chat}
            alt="Your Company"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Sign in to your account
          </h2>
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium leading-6 text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => handleChange(e)}
                />
                {emailError && (
                  <span className="text-red-500 text-xs">{emailError}</span>
                )}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium leading-6 text-gray-900"
                >
                  Password
                </label>
               
              </div>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  onChange={(e) => handleChange(e)}
                />
                {passwordError && (
                  <span className="text-red-500 text-xs">{passwordError}</span>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign in
              </button>
            </div>
          </form>

          <p className="mt-10 text-center text-sm text-gray-500">
            Not a member?{" "}
            <Link
              to="/signup"
              className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500"
            >
              Register Here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default SignIn;