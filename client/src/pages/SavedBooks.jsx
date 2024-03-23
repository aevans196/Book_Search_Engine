import {
  Container,
  Card,
  Button,
  Row,
  Col
} from 'react-bootstrap'; // Importing components from React Bootstrap library

import Auth from '../utils/auth'; // Importing authentication utility
import { removeBookId } from '../utils/localStorage'; // Importing function to remove book ID from local storage

// Importing GraphQL queries and mutations
import { GET_ME } from "../utils/queries";
import { DELETE_BOOK } from "../utils/mutations";
import { useQuery, useMutation } from '@apollo/client'; // Importing hooks for executing GraphQL queries and mutations

// Functional component for displaying saved books
const SavedBooks = () => {
  // GraphQL mutation for deleting a book
  const [deleteBook, { error }] = useMutation(DELETE_BOOK);

  // Get user data from authentication token
  const token = Auth.getToken();
  const user = Auth.getProfile(token);

  // Query user data from GraphQL server
  const { data, loading } = useQuery(GET_ME, {
    variables: { _id: user.data._id }
  });

  // Extract user data from query result
  const userData = data?.me || {};
  // Use this to determine if `useEffect()` hook needs to run again
  const userDataLength = Object.keys(userData).length;

  // Function to handle deletion of a book
  const handleDeleteBook = async (bookId) => {
    const token = Auth.loggedIn() ? Auth.getToken() : null;

    if (!token) {
      return false;
    }

    try {
      const { data } = await deleteBook({
        variables: {
          userId: userData._id,
          bookId: bookId
        },
      });

      // Upon success, remove book's ID from local storage and reload the page
      removeBookId(bookId);
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  // If data isn't here yet, display loading message
  if (!userDataLength) {
    return <h2>LOADING...</h2>;
  }

  // Rendering the saved books component
  return (
    <>
      {/* Header section */}
      <div fluid className="text-light bg-dark p-5">
        <Container>
          <h1>Viewing saved books!</h1>
        </Container>
      </div>
      {/* Main content section */}
      <Container>
        <h2 className='pt-5'>
          {/* Displaying number of saved books */}
          {userData.savedBooks.length
            ? `Viewing ${userData.savedBooks.length} saved ${userData.savedBooks.length === 1 ? 'book' : 'books'}:`
            : 'You have no saved books!'}
        </h2>
        {/* Displaying saved books as cards */}
        <Row>
          {userData.savedBooks.map((book) => {
            return (
              <Col md="4">
                <Card key={book.bookId} border='dark'>
                  {/* Displaying book image if available */}
                  {book.image ? <Card.Img src={book.image} alt={`The cover for ${book.title}`} variant='top' /> : null}
                  <Card.Body>
                    <Card.Title>{book.title}</Card.Title>
                    {/* Displaying book authors */}
                    <p className='small'>Authors: {book.authors}</p>
                    {/* Displaying book description */}
                    <Card.Text>{book.description}</Card.Text>
                    {/* Button to delete the book */}
                    <Button className='btn-block btn-danger' onClick={() => handleDeleteBook(book.bookId)}>
                      Delete this Book!
                    </Button>
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

export default SavedBooks; // Exporting the SavedBooks component