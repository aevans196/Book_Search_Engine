// Importing necessary hooks and components from React and React Bootstrap
import { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';

// Importing authentication utility functions and GraphQL mutation
import Auth from '../utils/auth';
import { LOGIN_USER } from '../utils/mutations';
import { useMutation } from '@apollo/client';

// Functional component for login form
const LoginForm = () => {
  // State variables for user form data, form validation, and alert visibility
  const [userFormData, setUserFormData] = useState({ email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // GraphQL mutation for user login
  const [login, { error, data }] = useMutation(LOGIN_USER);

  // Function to handle input changes in the form fields
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  // Function to handle form submission
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    // Check form validation status
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    }

    try {
      // Call the login mutation with user form data
      const { data } = await login({
        variables: { ...userFormData },
      });

      // If login is successful, set user token in local storage
      Auth.login(data.login.token);
    } catch (err) {
      console.error(err);
      // Show alert if login fails
      setShowAlert(true);
    }

    // Reset form data
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  // Rendering the login form
  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Alert for displaying login error */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your login credentials!
        </Alert>
        {/* Email input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your email'
            name='email'
            onChange={handleInputChange}
            value={userFormData.email}
            required
          />
          <Form.Control.Feedback type='invalid'>Email is required!</Form.Control.Feedback>
        </Form.Group>
        {/* Password input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='password'>Password</Form.Label>
          <Form.Control
            type='password'
            placeholder='Your password'
            name='password'
            onChange={handleInputChange}
            value={userFormData.password}
            required
          />
          <Form.Control.Feedback type='invalid'>Password is required!</Form.Control.Feedback>
        </Form.Group>
        {/* Submit button */}
        <Button
          disabled={!(userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default LoginForm; // Exporting the LoginForm component
