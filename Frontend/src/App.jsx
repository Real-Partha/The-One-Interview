import Home from './components/home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MainContent from './components/MainComponent/MainComponent';
import CreateQuestionPage from './components/CreateQuestionPage/CreateQuestionPage';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import GetUid from './components/getuid';
function App() {

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<div><Home /><MainContent /><CreateQuestionPage /></div>} />
          <Route path="/getuid" element={<GetUid />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;