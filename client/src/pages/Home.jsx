import React, { useEffect, useState } from "react";

function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  return (
    <div style={{ padding: "20px" }}>
      {user?.designation === "admin" ? (
        <h1>Welcome Admin, {user.name}</h1>
      ) : (
        <h1>Welcome {user?.name || "Guest"}</h1>
      )}
    </div>
  );
}

export default Home;
