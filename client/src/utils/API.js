// Function for sending a search request to the Google Books API
// The query parameter represents the user-entered search query
// Example usage: searchGoogleBooks('twilight')
export const searchGoogleBooks = (query) => {
  // Sending a GET request to the Google Books API with the provided query
  // The query parameter is appended to the API URL
  return fetch(`https://www.googleapis.com/books/v1/volumes?q=${query}`);
};
