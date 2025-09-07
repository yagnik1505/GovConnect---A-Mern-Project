import React from "react";

function Home() {
  // Try to get user from localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const role = (user.designation || "").toLowerCase();

  return (
    <div className="home-container">
      {role === "admin" ? (
        <h1>Welcome Admin 🎉</h1>
      ) : role === "government" ? (
        <h1>Welcome Government User 🏛️</h1>
      ) : role === "public" ? (
        <h1>Welcome Public User 🙌</h1>
      ) : (
        <h1>Welcome to the Home Page</h1>
      )}
    </div>
  );
}

export default Home;
