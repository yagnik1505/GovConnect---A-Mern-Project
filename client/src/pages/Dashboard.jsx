import React from "react";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isGov = user.userType === "Government";

  const publicPanels = [
    {
      title: "Available Schemes",
      desc: "View and apply for government schemes available to you.",
    },
    {
      title: "Scholarships",
      desc: "Browse scholarships and eligibility criteria for students.",
    },
    {
      title: "Profile",
      desc: "Manage your personal details and preferences.",
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

  return (
    <div className="container">
      <h1 className="text-3xl font-bold mb-6">
        Welcome, {user.name || "User"}!
      </h1>
      <p className="text-gray-600 mb-8">
        You are logged in as <strong>{user.userType}</strong>
        {isGov && ` (${user.department} - ${user.designation})`}
      </p>

      <div className="grid-3">
        {(isGov ? governmentPanels : publicPanels).map((p) => (
          <div
            key={p.title}
            className={`panel ${isGov ? "panel-government" : "panel-public"}`}
          >
            <h2 className="text-xl font-semibold mb-2">{p.title}</h2>
            <p className="text-gray-700">{p.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
