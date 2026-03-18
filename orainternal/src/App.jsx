import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Layout from "./components/Layout.jsx";
import Users from "./pages/Users.jsx";
import Cases from "./pages/Cases.jsx";
import Settings from "./pages/Settings.jsx";
import AuditLogs from "./pages/AuditLogs.jsx";
import StlViewer from "./pages/StlViewer.jsx";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/Login" element={<Login />}></Route>

          <Route element={<Layout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/users" element={<Users />} />
            <Route path="/cases" element={<Cases />} />

            <Route path="/Settings" element={<Settings />} />
            <Route path="/stl-viewer" element={<StlViewer />} />
            <Route path="/audit-logs" element={<AuditLogs />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
