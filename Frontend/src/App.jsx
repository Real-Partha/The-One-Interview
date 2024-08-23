import "@fortawesome/fontawesome-free/css/all.min.css";
import MainContent from "./components/MainComponent/MainComponent";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetUid from "./components/getuid";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import { ThemeProvider } from "./ThemeContext";
import Post from "./components/Posts/Post";
import Profile from "./components/Profile/Profile";
import NavBar from "./components/Navbar/Navbar";

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <BrowserRouter>
          <NavBar />
            <Routes>
              <Route path="/" element={<MainContent />} />
              <Route path="/question/:questionId" element={<Post />} />
              <Route path="/getuid" element={<GetUid />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
