import "@fortawesome/fontawesome-free/css/all.min.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { ThemeProvider } from "./ThemeContext";
import { Toaster } from 'react-hot-toast';

// Component imports
import MainContent from "./components/HomeQuestions/HomeQuestions";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
// import LoginRegister from "./components/Authentication/LoginRegister";
import Post from "./components/Posts/Post";
import Profile from "./components/Profile/Profile";
import NavBar from "./components/Navbar/Navbar";
import HomeComponent from "./components/HomeComponent/HomeComponent";
import AdminPage from './components/Admin/AdminPage';
import Footer from './components/Footer/Footer';
import NotFound from './components/commonPages/NotFound';
import CompanyPage from './components/CompanyPage/CompanyPage';
import UnderConstruction from './components/commonPages/UnderConstruction'
import AboutUs from "./components/Utility Pages/Aboutus/Aboutus";
import PrivacyPolicy from "./components/Utility Pages/PrivacyPolicy/PrivacyPolicy";
import FAQs from "./components/Utility Pages/FAQ/FAQ";
import MostUpvoted from "./components/MostUpvoted/MostUpvoted";



function AppContent() {
  const location = useLocation();
  // const hideNavBarAndFooterRoutes = ['/login', '/signup'];
  const hideNavBarAndFooterRoutes = ['/login-register'];
  const shouldShowNavBarAndFooter = !hideNavBarAndFooterRoutes.includes(location.pathname);

  return (
    <>
      <Toaster position="top-center" reverseOrder={false}/>
      {shouldShowNavBarAndFooter && <NavBar />}
      <Routes>
        <Route path="/" element={<HomeComponent />} />
        <Route path="/questions" element={<MainContent />} />
        <Route path="/question/:questionId" element={<Post />} />
        {/* <Route path="/login-register" element={<LoginRegister />} /> */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/company-questions" element={<CompanyPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/tags" element={<UnderConstruction />} />
        <Route path="/interview-blogs" element={<UnderConstruction />} />
        <Route path="/communities" element={<UnderConstruction />} />
        <Route path="*" element={<NotFound />} />
        <Route path="/about-us" element={<AboutUs />} />
        <Route path ="/privacy" element={<PrivacyPolicy />} />
        <Route path ="/faq" element={<FAQs />} />
        <Route path ="/most-upvoted" element={<MostUpvoted />} />
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
