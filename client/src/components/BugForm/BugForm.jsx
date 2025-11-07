import React, { useState } from 'react';
import { useBugs } from '../../context/BugContext';
import Button from '../Button';
import './BugForm.css';

const BugForm = () => {
  const { addBug, loading, error } = useBugs();
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    } else if (formData.title.length < 3) {
      newErrors.title = 'Title must be at least 3 characters';
    }

    // Bug: Missing validation for description field
    // if (!formData.description.trim()) {
    //   newErrors.description = 'Description is required';
    // } else if (formData.description.length < 10) {
    //   newErrors.description = 'Description must be at least 10 characters';
    // }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('BugForm: handleSubmit called with formData:', formData);

    if (!validateForm()) {
      console.log('BugForm: Form validation failed');
      return;
    }

    console.log('BugForm: Form validation passed, submitting...');
    setIsSubmitting(true);
    try {
      await addBug(formData);
      console.log('BugForm: Bug added successfully, resetting form');
      setFormData({ title: '', description: '' });
      setErrors({});
    } catch (error) {
      console.error('Error submitting bug:', error);
      // Error is handled by BugContext
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bug-form">
      <h2>Report a Bug</h2>
      {error && <div className="error-message">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="title">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={errors.title ? 'error' : ''}
            placeholder="Enter bug title"
          />
          {errors.title && <span className="error-message">{errors.title}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={errors.description ? 'error' : ''}
            placeholder="Describe the bug in detail"
            rows="4"
          />
          {errors.description && <span className="error-message">{errors.description}</span>}
        </div>

        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Bug'}
        </Button>
      </form>
    </div>
  );
};

export default BugForm;