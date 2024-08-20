// import React from 'react';
import './CreateQuestionPage.css';

const CreateQuestionPage = () => {
  return (
    <div className="create-question-container">
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          type="text"
          id="title"
          placeholder="Be specific and imagine you’re asking a question to another person."
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="details">What are the details of your problem?</label>
        <textarea
          id="details"
          placeholder="Introduce the problem and expand on what you put in the title."
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="tried">What did you try and what were you expecting?</label>
        <textarea
          id="tried"
          placeholder="Describe what you tried, what you expected to happen, and what actually resulted."
          className="form-control"
        />
      </div>
      <div className="form-group">
        <label htmlFor="tags">Tags</label>
        <input
          type="text"
          id="tags"
          placeholder="Add up to 5 tags to describe what your question is about."
          className="form-control"
        />
      </div>
      <div className="form-group">
        <button className="btn-next">Next</button>
      </div>
    </div>
  );
};

export default CreateQuestionPage;
