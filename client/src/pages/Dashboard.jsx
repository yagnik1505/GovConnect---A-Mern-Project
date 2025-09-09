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
      id: "schemes-section",
    },
    {
      title: "Scholarships",
      desc: "Browse scholarships and eligibility criteria for students.",
      id: "scholarships-section",
    },
    {
      title: "Profile",
      desc: "Manage your personal details and preferences.",
      id: "profile-section",
    },
  ];

  const governmentPanels = [
    {
      title: "Manage Schemes",
      desc: "Add, edit, or remove government schemes assigned to your department.",
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

  const handleNavigate = (sectionId) => {
    navigate("/dashboard", { state: { scrollTo: sectionId } });
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
            style={{ cursor: panel.id ? "pointer" : undefined }}
            onClick={() => panel.id && handleNavigate(panel.id)}
          >
            <h2 className="text-xl font-semibold mb-2">{panel.title}</h2>
            <p className="text-gray-700">{panel.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
