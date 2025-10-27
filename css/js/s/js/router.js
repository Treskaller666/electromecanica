import Login from "./pages/login.js";
import Dashboard from "./pages/dashboard.js";
import JobNew from "./pages/job-new.js";
import TorqueRegister from "./pages/torque-register.js";
import JefeDashboard from "./pages/jefe-dashboard.js";
import OemSearchPage from "./pages/oem-search.js";

const routes = {
  "/": Dashboard,
  "/login": Login,
  "/job-new": JobNew,
  "/torque": TorqueRegister,
  "/jefe": JefeDashboard,
  "/oem": OemSearchPage
};

export async function renderRoute() {
  const app = document.getElementById("app");
  const path = location.hash.replace("#","") || "/"; // "#/..."
  const Page = routes[path] || Dashboard;
  app.innerHTML = await Page();
}
