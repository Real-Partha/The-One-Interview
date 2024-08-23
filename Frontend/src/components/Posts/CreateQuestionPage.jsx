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
    question: '',
    experience: '',
    tags: []  // Add tags to the formData state
  });

  const { isDarkMode } = useTheme();
  const [tagInput, setTagInput] = useState('');  // State to manage tag input

  const handleChange = (value, field) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleTagAdd = () => {
    if (tagInput.trim()) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }));
      setTagInput('');  
    }
  };

  const handleTagRemove = (index) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log(formData);
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
        <label>Tags:</label>
        <div className="tags-input-container">
          {formData.tags.map((tag, index) => (
            <div key={index} className="tag-item">
              {tag}
              <span className="tag-remove" onClick={() => handleTagRemove(index)}>x</span>
            </div>
          ))}
          <input
            type="text"
            className="tag-input"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add tags that describe the post"
          />
          <button type="button" className="btn-add-tag" onClick={handleTagAdd}>Add Tag</button>
        </div>
      </div>
      <div className="form-group">
        <button type="submit" className="btn-submit">Submit</button>
      </div>
    </form>
  );
};

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
