import Home from './components/home';
import '@fortawesome/fontawesome-free/css/all.min.css';
import MainContent from './components/MainComponent/MainComponent';
import CreateQuestionPage from './components/CreateQuestionPage/CreateQuestionPage';
function App() {
  
  return (
    <div className="App">
      <Home />
      <MainContent/>
      <CreateQuestionPage/>

    </div>
  );
}

export default App;