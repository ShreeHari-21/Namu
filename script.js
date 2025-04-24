const backendURL = "https://script.google.com/macros/s/AKfycbzynQ8aLLsE5fwnX_1kYIa7N5TcXZD_nolcPImEEno1t6yuvawroyR3cTdbMgN1ri4RYg/exec";

let userInfo = {};

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  const reportForm = document.getElementById("reportForm");
  const toggleTheme = document.getElementById("toggleTheme");

  if (toggleTheme) {
    // Theme switching
    toggleTheme.addEventListener("click", () => {
      document.body.classList.toggle("dark");
      localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
    });

    // Load saved theme
    if (localStorage.getItem("theme") === "dark") {
      document.body.classList.add("dark");
    }
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;

      userInfo = { username, password };

      // Fetch data to test login
      const res = await fetch(backendURL, {
        method: "POST",
        body: JSON.stringify({ username, password, action: "fetch" }),
        headers: { "Content-Type": "application/json" },
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("user", JSON.stringify(userInfo));
        window.location.href = "dashboard.html";
      } else {
        document.getElementById("message").innerText = "Invalid login!";
      }
    });
  }

  if (reportForm) {
    // Pre-fill user from localStorage
    userInfo = JSON.parse(localStorage.getItem("user"));

    reportForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const reportData = {
        ...userInfo,
        action: "submit",
        date: document.getElementById("date").value,
        timeSlot: document.getElementById("timeSlot").value,
        activity: document.getElementById("activity").value,
        status: document.getElementById("status").value,
        remarks: document.getElementById("remarks").value,
      };

      const res = await fetch(backendURL, {
        method: "POST",
        body: JSON.stringify(reportData),
        headers: { "Content-Type": "application/json" },
      });

      const result = await res.json();
      alert(result.message);
      reportForm.reset();
    });
  }
});
