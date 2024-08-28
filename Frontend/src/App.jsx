import "@fortawesome/fontawesome-free/css/all.min.css";
import MainContent from "./components/HomeQuestions.jsx/HomeQuestions";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import GetUid from "./components/getuid";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import { ThemeProvider } from "./ThemeContext";
import Post from "./components/Posts/Post";
import Profile from "./components/Profile/Profile";
import NavBar from "./components/Navbar/Navbar";
import { Toaster } from 'react-hot-toast';
import HomeComponent from "./components/HomeComponent/HomeComponent";

function AppContent() {
  const location = useLocation();
  const hideNavBarRoutes = ['/login', '/signup'];
  const shouldShowNavBar = !hideNavBarRoutes.includes(location.pathname);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false}/>
      {shouldShowNavBar && <NavBar />}
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/questions" element={<MainContent />} />
        <Route path="/question/:questionId" element={<Post />} />
        <Route path="/getuid" element={<GetUid />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />

      </Routes>
    </>
  );
}

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
