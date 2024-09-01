// UnderConstruction.jsx
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import AceEditor from 'react-ace';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-monokai';
import { FaCode, FaCheck, FaTimes, FaRocket, FaHome, FaQuestion } from 'react-icons/fa';
import './UnderConstruction.css';
import { useTheme } from '../../ThemeContext';
import codeQuestions from './ConstructionQuestions.json';

const UnderConstruction = () => {
  const { isDarkMode } = useTheme();
  const [currentQuestion, setCurrentQuestion] = useState(codeQuestions[Math.floor(Math.random() * codeQuestions.length)]);
  const [code, setCode] = useState(currentQuestion.code);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showError, setShowError] = useState(false);
  const [output, setOutput] = useState('');

  const checkCode = () => {
    try {
      // eslint-disable-next-line no-new-func
      const userFunction = new Function(`return ${code}`)();
      const solutionFunction = new Function(`return ${currentQuestion.solution}`)();
      
      const results = currentQuestion.testInputs.map(inputs => {
        const userResult = JSON.stringify(userFunction(...inputs));
        const solutionResult = JSON.stringify(solutionFunction(...inputs));
        return { inputs, userResult, solutionResult, correct: userResult === solutionResult };
      });

      const isCorrect = results.every(r => r.correct);
      
      setOutput(results.map(r => 
        `Input: ${JSON.stringify(r.inputs)}\nYour output: ${r.userResult}\nExpected: ${r.solutionResult}\n${r.correct ? 'Correct' : 'Incorrect'}`
      ).join('\n\n'));

      setIsCorrect(isCorrect);
      if (!isCorrect) {
        setShowError(true);
        setTimeout(() => setShowError(false), 2000);
      }
    } catch (error) {
      setOutput(error.toString());
      setShowError(true);
      setTimeout(() => setShowError(false), 2000);
    }
  };

  const tryAnotherChallenge = () => {
    const newQuestion = codeQuestions[Math.floor(Math.random() * codeQuestions.length)];
    setCurrentQuestion(newQuestion);
    setCode(newQuestion.code);
    setIsCorrect(false);
    setOutput('');
  };

  return (
    <div className={`construction-container ${isDarkMode ? 'construction-dark' : ''}`}>
      <div className="construction-content">
        <h1 className="construction-title">Page Under Construction</h1>
        <div className="construction-icon-wrapper">
          <FaCode className="construction-icon" />
        </div>
        <h2 className="construction-subtitle">While We're Working...</h2>
        <p className="construction-message">
          Try this JavaScript coding challenge! (P.S: It's just for fun!)
        </p>
        <p className="construction-question">{currentQuestion.question}</p>
        <AceEditor
          mode="javascript"
          theme={isDarkMode ? "monokai" : "github"}
          onChange={setCode}
          name="code-editor"
          editorProps={{ $blockScrolling: true }}
          setOptions={{
            showLineNumbers: true,
            tabSize: 2,
          }}
          style={{ width: '100%', height: '150px' }}
          value={code}
        />
        <button className="construction-button" onClick={checkCode}>
          Run Code
        </button>
        {output && (
          <div className="construction-output">
            <h3>Output:</h3>
            <pre>{output}</pre>
          </div>
        )}
        {showError && (
          <p className="construction-error">
            <FaTimes /> Oops! That didn't work. Try again!
          </p>
        )}
        {isCorrect && (
          <div className="construction-success">
            <p><FaCheck /> Excellent work on the coding challenge!</p>
            <p className="construction-redirect-message">
              <FaRocket /> Want to try another challenge?
            </p>
            <button className="construction-button" onClick={tryAnotherChallenge}>
              Try Another Challenge
            </button>
          </div>
        )}
        <p className="construction-subline">
          Remember: This game won't fix the site, but it might fix your boredom!
        </p>
        <div className="construction-navigation">
          <Link to="/" className="construction-nav-button">
            <FaHome className="construction-button-icon" />
            Home
          </Link>
          <Link to="/questions" className="construction-nav-button">
            <FaQuestion className="construction-button-icon" />
            Questions
          </Link>
        </div>
      </div>
      <div className="construction-particles">
        {[...Array(20)].map((_, index) => (
          <div key={index} className="construction-particle"></div>
        ))}
      </div>
    </div>
  );
};

export default UnderConstruction;
