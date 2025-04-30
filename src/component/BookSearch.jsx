import React, { useState, useEffect } from 'react';
import axios from 'axios';

function BookSearch() {
    const [query, setQuery] = useState('');
    const [books, setBooks] = useState([]);
    const [page, setPage] = useState(1);
    const [uploadFile, setUploadFile] = useState(null);

    const fetchBooks = async () => {
        try {
            const res = await axios.get('https://openlibrary.org/search.json', {
                params: { q: query, page }
            });
            setBooks(res.data.docs);
        } catch (error) {
            console.error('Error fetching books:', error);
        }
    };

    useEffect(() => {
        if (query) fetchBooks();
    }, [query, page]);

    const handleSearch = (e) => {
        e.preventDefault();
        setPage(1);
        fetchBooks();
    };

    const handleFileChange = (e) => {
        setUploadFile(e.target.files[0]);
        // Optional: handle file upload logic
    };

    return (
        <div className="book-search-container">
            <h2>Book Search</h2>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search by title or author"
                />
                <button type="submit">Search</button>
            </form>

            <div style={{ marginTop: '1rem' }}>
                <label>Upload (Optional): </label>
                <input type="file" onChange={handleFileChange} />
            </div>

            <div style={{ marginTop: '2rem' }}>
                {books.length > 0 ? (
                    <ul>
                        {books.map((book, idx) => (
                            <li key={idx}>
                                <div>
                                    <img
                                        src={`https://covers.openlibrary.org/b/id/${book.cover_i}-L.jpg`}
                                        alt={book.title}
                                        style={{ width: '100px', height: '150px' }}
                                    />
                                </div>
                                <div>
                                    <strong>{book.title}</strong>
                                    <p>{book.author_name?.join(', ')}</p>
                                </div>
                            </li>
                        ))}
                    </ul>
                ) : (
                    query && <p>No results found.</p>
                )}
            </div>

            {books.length > 0 && (
                <div className="pagination">
                    <button onClick={() => setPage((prev) => Math.max(prev - 1, 1))} disabled={page === 1}>
                        Prev
                    </button>
                    <span style={{ margin: '0 1rem' }}>Page {page}</span>
                    <button onClick={() => setPage((prev) => prev + 1)}>
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}

export default BookSearch;
