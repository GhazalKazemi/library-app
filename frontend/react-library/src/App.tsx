import React from 'react';
import './App.css';
import { Navbar } from './layouts/navbar-footer/Navbar';
import { Footer } from './layouts/navbar-footer/Footer';
import { HomePage } from './layouts/homepage/HomePage';
import { SearchBooksPage } from './layouts/SearchBooks/SearchBooksPage';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import { BookCheckoutPage } from './layouts/BookCheckoutPage/BookCheckoutPage';
import { OktaConfig } from './lib/OktaConfig';
import { OktaAuth, toRelativeUrl } from '@okta/okta-auth-js';
import LoginWidget from './Auth/LoginWidget';
import { LoginCallback, Security } from '@okta/okta-react';
import { ReviewListPage } from './layouts/BookCheckoutPage/ReviewListPage/ReviewListPage';

const oktaAuth = new OktaAuth(OktaConfig);

export const App = () => {

  const customAuthHandler = () => {
    navigate('/login');
  }

  const navigate = useNavigate(); //Could use history for react-routher-dom version < 6 then history.push()

  const restoreOriginalUri = async (_oktaAuth: any, originalUri: any) => {
    navigate(toRelativeUrl(originalUri || '/', window.location.origin)); // < v6 history.replace()
  };

  return (
    <div className='d-flex flex-column min-vh-100'>
      <Security oktaAuth={oktaAuth} restoreOriginalUri={restoreOriginalUri} onAuthRequired={customAuthHandler} >
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
            <Route path='/checkout/:bookId' element={<BookCheckoutPage />}>
              {/* <BookCheckoutPage /> */}
            </Route>
            <Route path='/reviewlist/:bookId' element={<ReviewListPage />}>
              {/* <BookCheckoutPage /> */}
            </Route>
            <Route path='/login' element={
              <LoginWidget config={OktaConfig} />
            }
            />
            <Route path='/login/callback' element={<LoginCallback />} />
          </Routes>
        </div>
        <Footer />
      </Security>
    </div>
  );
}

export default App;
