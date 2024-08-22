import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateQuestionPage.css';
import { useTheme } from '../../ThemeContext';
const CreateQuestionPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    rounds: '',
    location: '',
    role: '',
    experience: ''
  });

  const { isDarkMode } = useTheme();

  const handleChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
    // Here you would typically handle the submission to a backend server
  };

  return (
    <form className="interview-experience-container" onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="companyName">Company Name:</label>
        <input
          type="text"
          id="companyName"
          className="form-control"
          value={formData.companyName}
          onChange={(e) => handleChange(e.target.value, 'companyName')}
        />
      </div>
      {/* <div className="form-group">
        <label htmlFor="rounds">No of Rounds:</label>
        <input
          type="number"
          id="rounds"
          className="form-control"
          value={formData.rounds}
          onChange={(e) => handleChange(e.target.value, 'rounds')}
        />
      </div> */}
      <div className="form-group">
        <label htmlFor="location">In which Round can the Question be Expected? </label>
        <select
          id="location"
          className="form-control special-form-control"
          value={formData.location}
          onChange={(e) => handleChange(e.target.value, 'location')}
        >
          <option value="techinterview">Technical Interviews</option>
          <option value="hrinterview">HR Interviews</option>
          <option value="aptitide">Aptitude</option>
        <option value="onlinecoding">Online Coding Round</option>        
        <option value="general">General</option>        

        </select>
      </div>
      <div className="form-group">
        <label htmlFor="role">Role:</label>
        <input
          type="text"
          id="role"
          className="form-control"
          value={formData.role}
          onChange={(e) => handleChange(e.target.value, 'role')}
        />
      </div>
      <div className="form-group">
        <label htmlFor="Question">What was the Question asked?</label>
        <input
          type="text"
          id="question"
          className="form-control"
          value={formData.question}
          onChange={(e) => handleChange(e.target.value, 'question')}
        />
      </div>
      <div className="form-group">
        <label htmlFor="experience">What should be the Perfect Answer? </label>
        <ReactQuill
          theme="snow"
          value={formData.experience}
          onChange={(value) => handleChange(value, 'experience')}
          modules={CreateQuestionPage.modules}
          formats={CreateQuestionPage.formats}
        />
      </div>
      <div className="form-group">
        <button type="submit" className="btn-submit">Submit</button>
      </div>
    </form>
  );
};

// Specify the necessary Quill modules and formats
CreateQuestionPage.modules = {
  toolbar: [
    [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
    [{ 'size': [] }],
    ['bold', 'italic', 'underline', 'strike', 'blockquote'],
    [{'list': 'ordered'}, {'list': 'bullet'}, 
     {'indent': '-1'}, {'indent': '+1'}],
    ['link', 'image', 'code-block']
  ],
  clipboard: {
    // Match visual, not semantic, structure:
    matchVisual: false,
  }
};

CreateQuestionPage.formats = [
  'header', 'font', 'size',
  'bold', 'italic', 'underline', 'strike', 'blockquote',
  'list', 'bullet', 'indent',
  'link', 'image', 'code-block'
];

export default CreateQuestionPage;
