import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./features/auth/AuthPage";
import Lk from "./features/lk/Lk_page";
import { AuthProvider } from "./contexts/AuthContext";
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<AuthPage />} />
          <Route path="/lk" element={<Lk />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
