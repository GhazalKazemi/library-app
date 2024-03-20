import React from 'react';
import './App.css';
import { Navbar } from './layouts/navbar-footer/Navbar';
import { Footer } from './layouts/navbar-footer/Footer';
import { HomePage } from './layouts/homepage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooks/SearchBooksPage';
import { Navigate, Route, Routes } from 'react-router-dom';

export const App = () => {
  return (
    <div className='d-flex flex-column min-vh-100'>
      <Navbar />
      <div className='flex-grow-1'>
        {/* React Router Dom v6 -- for v5 need to use Switch instead and element is not needed */}
        <Routes>
          <Route path='/' element={<Navigate to='/home' />}>

          </Route>
          <Route path='/home' element={<HomePage />}>
            {/* <HomePage /> */}
          </Route>
          <Route path='/search' element={<SearchBooksPage />}>
            {/* <SearchBooksPage /> */}
          </Route>
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

export default App;
