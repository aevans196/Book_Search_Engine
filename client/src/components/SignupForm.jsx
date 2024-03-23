import { useState } from 'react'; // Importing useState hook from React
import { Form, Button, Alert } from 'react-bootstrap'; // Importing form-related components from React Bootstrap

// Importing authentication utility functions and GraphQL mutation
import Auth from '../utils/auth';
import { ADD_USER } from '../utils/mutations';
import { useMutation } from '@apollo/client';

// Functional component for signup form
const SignupForm = () => {
  // State variables for user form data, form validation, and alert visibility
  const [userFormData, setUserFormData] = useState({ username: '', email: '', password: '' });
  const [validated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  // GraphQL mutation for adding a new user
  const [addUser, { error, data }] = useMutation(ADD_USER);

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
      // Call the addUser mutation with user form data
      const { data } = await addUser({
        variables: { ...userFormData },
      });

      // If signup is successful, set user token in local storage
      Auth.login(data.addUser.token);
    } catch (err) {
      console.error(err);
      // Show alert if signup fails
      setShowAlert(true);
    }

    // Reset form data
    setUserFormData({
      username: '',
      email: '',
      password: '',
    });
  };

  // Rendering the signup form
  return (
    <>
      {/* Form element with validation and submission handlers */}
      <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
        {/* Alert for displaying signup error */}
        <Alert dismissible onClose={() => setShowAlert(false)} show={showAlert} variant='danger'>
          Something went wrong with your signup!
        </Alert>
        {/* Username input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='username'>Username</Form.Label>
          <Form.Control
            type='text'
            placeholder='Your username'
            name='username'
            onChange={handleInputChange}
            value={userFormData.username}
            required
          />
          <Form.Control.Feedback type='invalid'>Username is required!</Form.Control.Feedback>
        </Form.Group>
        {/* Email input field */}
        <Form.Group className='mb-3'>
          <Form.Label htmlFor='email'>Email</Form.Label>
          <Form.Control
            type='email'
            placeholder='Your email address'
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
          disabled={!(userFormData.username && userFormData.email && userFormData.password)}
          type='submit'
          variant='success'>
          Submit
        </Button>
      </Form>
    </>
  );
};

export default SignupForm; // Exporting the SignupForm component