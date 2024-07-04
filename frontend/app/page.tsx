"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axiosInstance from "./data";

export default function Home() {
  
  const [tab, setTab] = useState("1");

  // State variables to store form data and errors
  const [signupData, setSignupData] = useState({
    firstName: "",
    lastName: "",
    dob: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // State variables for form validation errors
  const [signupErrors, setSignupErrors] = useState({});
  const [loginErrors, setLoginErrors] = useState({});

  // Function to handle signup form submission
  const handleSignupSubmit = async (event: any) => {
    event.preventDefault();

    // Validate form inputs
    const errors = {};
    if (!signupData.firstName) {
      errors.firstName = "First Name is required";
    }
    if (!signupData.lastName) {
      errors.lastName = "Last Name is required";
    }
    if (!signupData.dob) {
      errors.dob = "Date of Birth is required";
    }
    if (!signupData.email) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(signupData.email)) {
      errors.email = "Email is invalid";
    }
    if (!signupData.password) {
      errors.password = "Password is required";
    } else if (signupData.password.length < 6) {
      errors.password = "Password must be at least 6 characters long";
    }
    if (!signupData.confirmPassword) {
      errors.confirmPassword = "Confirm Password is required";
    } else if (signupData.password !== signupData.confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }

    // Set errors and prevent form submission if there are errors
    if (Object.keys(errors).length > 0) {
      setSignupErrors(errors);
      return;
    } else {
      setSignupErrors({});
    }

    try {
      // Example of signup data structure
      const response = await axiosInstance.post(
        "http://localhost:5000/api/signup",
        signupData
      );
      console.log("Signup response:", response.data);

      // Clear signup form fields after successful submission (optional)
      setSignupData({
        firstName: "",
        lastName: "",
        dob: "",
        email: "",
        password: "",
        confirmPassword: "",
      });
    } catch (error) {
      console.error("Error submitting signup:", error);
    }
  };

  // Function to handle login form submission
  const Router = useRouter();
  const handleLoginSubmit = async (event: any) => {
    
    event.preventDefault();

    // Validate form inputs
    const errors = {};
    if (!loginData.username) {
      errors.username = "Username is required";
    }
    if (!loginData.password) {
      errors.password = "Password is required";
    }

    // Set errors and prevent form submission if there are errors
  

    try {
      const response = await axiosInstance.post(
        "http://localhost:5000/api/login",
        loginData
      );
      console.log("Login response:", response.data );

      localStorage.setItem('username',response.data.user.firstName);

      // Store token in localStorage or session storage
      localStorage.setItem("token", response.data.token);
      // Redirect to home page after successful login
      
      Router.push("/users");
      // Optionally handle success response, e.g., redirect to dashboard
    } catch (error) {
      errors.login=error.response.data;
      console.log( error.response.data);
      if (Object.keys(errors).length > 0) {
        setLoginErrors(errors);
        return;
      } else {
        setLoginErrors({});
      }
    }
  };

  return (
    <div className="flex justify-center py-20">
      <div className="w-[500px] pb-4 rounded-2xl bg-gray-400 text-white border-2">
        <div className="flex border-b-2 justify-between">
          <button
            onClick={() => setTab("1")}
            className={
              tab == "1"
                ? "w-1/2 py-3  flex justify-center border-r-2 bg-gray-600 rounded-ss-xl"
                : "w-1/2 py-3  flex justify-center border-r-2 "
            }
          >
            <h1 className="text-2xl font-bold">Sign up</h1>
          </button>

          <button
            onClick={() => setTab("2")}
            className={
              tab == "2"
                ? "w-1/2 py-3 flex justify-center bg-gray-600 rounded-se-xl"
                : "w-1/2 py-3 flex justify-center"
            }
          >
            <h1 className="text-2xl font-bold">login</h1>
          </button>
        </div>
        <div className="w-full ">
          <form
            onSubmit={handleSignupSubmit}
            className={
              tab === "1"
                ? "flex flex-col py-4 space-y-3 justify-center px-5"
                : "hidden"
            }
          >
            <div className="flex flex-col">
              <label htmlFor="fname">First Name:</label>
              <input
                className={`h-10 rounded-lg text-black px-3 ${
                  signupErrors.firstName ? "border-red-500" : ""
                }`}
                id="fname"
                type="text"
                value={signupData.firstName}
                onChange={(e) =>
                  setSignupData({ ...signupData, firstName: e.target.value })
                }
              />
              {signupErrors.firstName && (
                <p className="text-red-500 text-sm">{signupErrors.firstName}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="lname">Last Name:</label>
              <input
                className={`h-10 rounded-lg text-black px-3 ${
                  signupErrors.lastName ? "border-red-500" : ""
                }`}
                id="lname"
                type="text"
                value={signupData.lastName}
                onChange={(e) =>
                  setSignupData({ ...signupData, lastName: e.target.value })
                }
              />
              {signupErrors.lastName && (
                <p className="text-red-500 text-sm">{signupErrors.lastName}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="pr-12" htmlFor="dob">
                DOB:
              </label>
              <input
                className={`w-1/2 px-3 h-10 rounded-lg text-black ${
                  signupErrors.dob ? "border-red-500" : ""
                }`}
                type="date"
                id="dob"
                value={signupData.dob}
                onChange={(e) =>
                  setSignupData({ ...signupData, dob: e.target.value })
                }
              />
              {signupErrors.dob && (
                <p className="text-red-500 text-sm">{signupErrors.dob}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label className="pr-10 " htmlFor="email">
                email:
              </label>
              <input
                className={`h-10 rounded-lg text-black px-3 ${
                  signupErrors.email ? "border-red-500" : ""
                }`}
                type="text"
                id="email"
                value={signupData.email}
                onChange={(e) =>
                  setSignupData({ ...signupData, email: e.target.value })
                }
              />
              {signupErrors.email && (
                <p className="text-red-500 text-sm">{signupErrors.email}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="pass">Password:</label>
              <input
                className={`h-10 rounded-lg text-black px-3 ${
                  signupErrors.password ? "border-red-500" : ""
                }`}
                id="pass"
                type="password"
                value={signupData.password}
                onChange={(e) =>
                  setSignupData({ ...signupData, password: e.target.value })
                }
              />
              {signupErrors.password && (
                <p className="text-red-500 text-sm">{signupErrors.password}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="cpass">Confirm Password:</label>
              <input
                className={`h-10 rounded-lg text-black px-3 ${
                  signupErrors.confirmPassword ? "border-red-500" : ""
                }`}
                id="cpass"
                type="password"
                value={signupData.confirmPassword}
                onChange={(e) =>
                  setSignupData({
                    ...signupData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              {signupErrors.confirmPassword && (
                <p className="text-red-500 text-sm">
                  {signupErrors.confirmPassword}
                </p>
              )}
            </div>
            <button
              className="border-2 h-12 rounded-lg hover:bg-gray-600"
              type="submit"
            >
              Sign in
            </button>
          </form>
          <form
            onSubmit={handleLoginSubmit}
            className={
              tab === "2"
                ? "flex flex-col py-4 space-y-3 justify-center px-5"
                : "hidden"
            }
          >
            <div className="flex flex-col">
              <label htmlFor="username">Gmail:</label>
              <input
                className={`h-10 rounded-lg text-black px-3 ${
                  loginErrors.username ? "border-red-500" : ""
                }`}
                id="username"
                type="text"
                value={loginData.username}
                onChange={(e) =>
                  setLoginData({ ...loginData, username: e.target.value })
                }
              />
              {loginErrors.username && (
                <p className="text-red-500 text-sm">{loginErrors.username}</p>
              )}
            </div>
            <div className="flex flex-col">
              <label htmlFor="loginPass">Password:</label>
              <input
                className={`h-10 rounded-lg text-black px-3 ${
                  loginErrors.password ? "border-red-500" : ""
                }`}
                id="loginPass"
                type="password"
                value={loginData.password}
                onChange={(e) =>
                  setLoginData({ ...loginData, password: e.target.value })
                }
              />
              {loginErrors.password && (
                <p className="text-red-500 text-sm">{loginErrors.password}</p>
              )}
              {loginErrors.login && (
                <p className="text-red-500 text-sm">{loginErrors.login}</p>
              )}
            </div>
            <div className="pt-3">
              <button
                className="border-2 w-full h-12 rounded-lg  hover:bg-gray-600"
                type="submit"
              >
                Log in
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
