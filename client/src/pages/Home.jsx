import React from "react";
import { useNavigate } from "react-router-dom";
import CrisisStats from "../components/CrisisStats";
import GovernmentStats from "../components/GovernmentStats";

function Home() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const userType = (user.userType || "").toLowerCase();
  const designation = (user.designation || "").toLowerCase();
  const isAdmin = designation === "admin";
  const isGovEmployee = userType === "government" && !isAdmin;

  const publicTiles = [
    { title: "Scholarships", desc: "Browse scholarships", link: "/scholarships" },
    { title: "Schemes", desc: "Explore government schemes", link: "/schemes" },
    { title: "Report Crisis", desc: "Report an issue to the government", link: "/report-crisis" },
  ];

  const governmentTiles = [
    { title: "Add Scheme", desc: "Create a new scheme", link: "/schemes/add" },
    { title: "Add Scholarship", desc: "Create a new scholarship", link: "/scholarships/add" },
    { title: "See Crises", desc: "View reported crises", link: "/dashboard" },
  ];

  const tiles = isGovEmployee ? governmentTiles : publicTiles;

  return (
    <div className="container">
      {isAdmin ? (
        <h1 className="text-3xl font-bold mb-6">Welcome Admin 🎉</h1>
      ) : isGovEmployee ? (
        <h1 className="text-3xl font-bold mb-6">Welcome Government User 🏛️</h1>
      ) : userType === "public" ? (
        <h1 className="text-3xl font-bold mb-6">Welcome Public User 🙌</h1>
      ) : (
        <h1 className="text-3xl font-bold mb-6">Welcome to the Home Page</h1>
      )}

      {!isAdmin && (
        <div className="grid-3">
          {tiles.map((t) => (
            <div key={t.title} className={`panel ${isGovEmployee ? "panel-government" : "panel-public"}`} style={{ cursor: "pointer" }} onClick={() => navigate(t.link)}>
              <h2 className="text-xl font-semibold mb-2">{t.title}</h2>
              <p>{t.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* Crisis Statistics Charts - Different views for different user types */}
      {isGovEmployee ? (
        <GovernmentStats />
      ) : (
        <CrisisStats />
      )}
    </div>
  );
}

export default Home;
