'use client';
import { useState, useEffect } from 'react';
import { booksAPI } from '@/lib/api/books';

export const useBooks = (filters = {}) => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const fetchBooks = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await booksAPI.getAll(filters);
      
      if (response.success) {
        setBooks(response.data);
        setPagination(response.pagination);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    books,
    loading,
    error,
    pagination,
    refetch: fetchBooks,
  };
};

export const useBook = (id) => {
  const [book, setBook] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (id) {
      fetchBook();
    }
  }, [id]);

  const fetchBook = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await booksAPI.getById(id);
      
      if (response.success) {
        setBook(response.data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return {
    book,
    loading,
    error,
    refetch: fetchBook,
  };
};
