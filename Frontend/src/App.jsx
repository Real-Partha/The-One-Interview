import Home from "./components/Home";
import "@fortawesome/fontawesome-free/css/all.min.css";
import MainContent from "./components/MainComponent/MainComponent";
import CreateQuestionPage from "./components/CreateQuestionPage/CreateQuestionPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GetUid from "./components/getuid";
import Login from "./components/Authentication/Login";
import Signup from "./components/Authentication/Signup";
import { ThemeProvider } from "./ThemeContext";

function App() {
  return (
    <div className="App">
      <ThemeProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <div>
                  <Home />
                  <MainContent />
                  {/* <CreateQuestionPage /> */}
                </div>
              }
            />
            <Route path="/getuid" element={<GetUid />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </BrowserRouter>
      </ThemeProvider>
    </div>
  );
}

export default App;
