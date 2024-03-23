import { useState, useEffect } from 'react'; // Importing hooks from React
import {
  Container,
  Col,
  Form,
  Button,
  Card,
  Row
} from 'react-bootstrap'; // Importing components from React Bootstrap library

import Auth from '../utils/auth'; // Importing authentication utility
import { searchGoogleBooks } from '../utils/API'; // Importing function to search books from Google Books API
import { saveBookIds, getSavedBookIds } from '../utils/localStorage'; // Importing functions to manage saved book IDs in local storage

import { useMutation } from '@apollo/client'; // Importing hook for executing GraphQL mutations
import { SAVE_BOOK } from '../utils/mutations'; // Importing GraphQL mutation for saving a book

// Functional component for searching books
const SearchBooks = () => {
  // State variables for managing searched books, search input, and saved book IDs
  const [searchedBooks, setSearchedBooks] = useState([]); 
  const [searchInput, setSearchInput] = useState('');
  const [savedBookIds, setSavedBookIds] = useState(getSavedBookIds());

  const [saveBook, { error }] = useMutation(SAVE_BOOK); // GraphQL mutation for saving a book

  // useEffect hook to save `savedBookIds` list to localStorage on component unmount
  useEffect(() => {
    return () => saveBookIds(savedBookIds);
  });

  // Function to search for books and set state on form submit
  const handleFormSubmit = async (event) => {
    event.preventDefault();

    if (!searchInput) {
      return false;
    }

    try {
      const response = await searchGoogleBooks(searchInput);

      if (!response.ok) {
        throw new Error('something went wrong!');
      }

      const { items } = await response.json();

      // Extracting relevant book data from API response
      const bookData = items.map((book) => ({
        bookId: book.id,
        authors: book.volumeInfo.authors || ['No author to display'],
        title: book.volumeInfo.title,
        description: book.volumeInfo.description,
        image: book.volumeInfo.imageLinks?.thumbnail || '',
      }));

      // Updating searchedBooks state with retrieved book data
      setSearchedBooks(bookData);
      setSearchInput('');
    } catch (err) {
      console.error(err);
    }
  };

  // Function to handle saving a book to database
  const handleSaveBook = async (bookId) => {
    // Finding the book in `searchedBooks` state by the matching ID
    const bookToSave = searchedBooks.find((book) => book.bookId === bookId);

    // Getting authentication token
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await saveBook({
        variables: {
          input: { ...bookToSave }
        }
      });

      // If book successfully saves to user's account, update savedBookIds state
      setSavedBookIds([...savedBookIds, bookToSave.bookId]);
    } catch (err) {
      console.error(err);
    }
  };

  // Rendering the SearchBooks component
  return (
    <>
      {/* Header section */}
      <div className="text-light bg-dark p-5">
        <Container>
          <h1>Search for Books!</h1>
          {/* Form for searching books */}
          <Form onSubmit={handleFormSubmit}>
            <Row>
              <Col xs={12} md={8}>
                {/* Search input field */}
                <Form.Control
                  name='searchInput'
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  type='text'
                  size='lg'
                  placeholder='Search for a book'
                />
              </Col>
              <Col xs={12} md={4}>
                {/* Submit button */}
                <Button type='submit' variant='success' size='lg'>
                  Submit Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </div>

      {/* Main content section */}
      <Container>
        <h2 className='pt-5'>
          {/* Displaying number of search results */}
          {searchedBooks.length
            ? `Viewing ${searchedBooks.length} results:`
            : 'Search for a book to begin'}
        </h2>
        <Row>
          {/* Displaying search results as cards */}
          {searchedBooks.map((book) => {
            return (
              <Col md="4" key={book.bookId}>
                <Card border='dark'>
                  {/* Displaying book image if available */}
                  {book.image ? (
                    <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' />
                  ) : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    {/* Displaying book authors */}
                    <p className='small'>Authors: {book.authors}</p>
                    {/* Displaying book description */}
                    <Card.Text>{book.description}</Card.Text>
                    {/* Button to save the book */}
                    {Auth.loggedIn() && (
                      <Button
                        disabled={savedBookIds?.some((savedBookId) => savedBookId === book.bookId)}
                        className='btn-block btn-info'
                        onClick={() => handleSaveBook(book.bookId)}>
                        {/* Displaying appropriate text based on book save status */}
                        {savedBookIds?.some((savedBookId) => savedBookId === book.bookId)
                          ? 'This book has already been saved!'
                          : 'Save this Book!'}
                      </Button>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
      </Container>
    </>
  );
};

export default SearchBooks; // Exporting the SearchBooks component