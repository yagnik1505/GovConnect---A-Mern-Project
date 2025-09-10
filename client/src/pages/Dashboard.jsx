import React from "react";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isGov = user.userType === "government";
  const navigate = useNavigate();

  const publicPanels = [
    {
      title: "Available Schemes",
      desc: "View and apply for government schemes available to you.",
      link: "/schemes",
    },
    {
      title: "Scholarships",
      desc: "Browse scholarships and eligibility criteria for students.",
      link: "/scholarships",
    },
    {
      title: "Profile",
      desc: "Manage your personal details and preferences.",
      link: "/profile",
    },
  ];

  const governmentPanels = [
    {
      title: "Manage Schemes",
      desc: "Add, edit, remove government schemes assigned to your department.",
    },
    {
      title: "Review Applications",
      desc: "View and approve applications submitted by citizens.",
    },
    {
      title: "Department Dashboard",
      desc: "Monitor all ongoing programs and statistics.",
    },
  ];

  const panels = isGov ? governmentPanels : publicPanels;

  const handleNavigate = (panel) => {
    if (panel.link) navigate(panel.link);
  };

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.name || "User"}!</h1>
      <p className="text-gray-600 mb-8">
        You are logged in as <strong>{user.userType}</strong>
        {isGov && ` (${user.designation})`}
      </p>
      <div className="grid-3">
        {panels.map((panel) => (
          <div
            key={panel.title}
            className={`panel ${isGov ? "panel-government" : "panel-public"}`}
            style={{ cursor: panel.link ? "pointer" : undefined }}
            onClick={() => handleNavigate(panel)}
          >
            <h2 className="text-xl font-semibold mb-2">{panel.title}</h2>
            <p>{panel.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
