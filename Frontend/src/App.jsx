// App.jsx
import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import { Toaster } from 'react-hot-toast';

// Component imports
import MainContent from "./components/HomeQuestions/HomeQuestions";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import Post from "./components/Posts/Post";
import Profile from "./components/Profile/Profile";
import NavBar from "./components/Navbar/Navbar";
import HomeComponent from "./components/HomeComponent/HomeComponent";
import AdminPage from './components/Admin/AdminPage';
import Footer from './components/Footer/Footer';
import NotFound from './components/commonPages/NotFound';

import CompanyPage from './components/CompanyPage/CompanyPage';




function AppContent() {
  const location = useLocation();
  const hideNavBarAndFooterRoutes = ['/login', '/signup'];
  const shouldShowNavBarAndFooter = !hideNavBarAndFooterRoutes.includes(location.pathname);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false}/>
      {shouldShowNavBarAndFooter && <NavBar />}
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/questions" element={<MainContent />} />
        <Route path="/question/:questionId" element={<Post />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/company-questions" element={<CompanyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {shouldShowNavBarAndFooter && <Footer />}
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
