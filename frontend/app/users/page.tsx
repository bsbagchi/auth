"use client";
import React, { useEffect, useState } from "react";
import axiosInstance from "../data";
import { useRouter } from "next/navigation";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [username,setUsername]=useState(localStorage.getItem("username"));
  const Router = useRouter();
  useEffect(() => {

    const token = localStorage.getItem("token");
    if (!token) {
      Router.push("/");
    }
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get("/users"); // Adjusted endpoint path
        setUsers(response.data); // Directly set the response data into users state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchUsers();
  }, []); // Empty dependency array to run the effect only once

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    Router.push("/");
  };

  console.log(users);
  return (
    <div>
      <div className="flex justify-between py-6 px-3">
        {" "}
        <h1 className="text-black font-sans text-3xl">
          Hello {username}
        </h1>{" "}
        <button
          className="w-28 h-12 rounded-2xl bg-gray-700 text-xl font-black text-white"
          onClick={logout}
        >
          log out
        </button>
      </div>

      {/* Custom heading for the grid */}
      <div className="grid grid-cols-4 border-2 border-black p-2 mx-2 font-bold">
        <div>First Name</div>
        <div>Last Name</div>
        <div>Date of Birth</div>
        <div>Email</div>
      </div>
      {users.map((user) => (
        <div
          key={user._id}
          className="grid grid-cols-4 border-2  border-black mx-2 p-2"
        >
          <div>{user.firstName}</div>
          <div>{user.lastName}</div>
          <div>{user.dob}</div>
          <div>{user.email}</div>
        </div>
      ))}
    </div>
  );
};

export default Users;
