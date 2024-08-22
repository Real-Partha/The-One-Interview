import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import './CreateQuestionPage.css';

const CreateQuestionPage = () => {
  const [formData, setFormData] = useState({
    companyName: '',
    rounds: '',
    location: '',
    role: '',
    experience: ''
  });

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
      <div className="form-group">
        <label htmlFor="rounds">No of Rounds:</label>
        <input
          type="number"
          id="rounds"
          className="form-control"
          value={formData.rounds}
          onChange={(e) => handleChange(e.target.value, 'rounds')}
        />
      </div>
      <div className="form-group">
        <label htmlFor="location">On-Campus / Off-Campus:</label>
        <select
          id="location"
          className="form-control"
          value={formData.location}
          onChange={(e) => handleChange(e.target.value, 'location')}
        >
          <option value="on-campus">On-Campus</option>
          <option value="off-campus">Off-Campus</option>
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
        <label htmlFor="experience">Experience:</label>
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
