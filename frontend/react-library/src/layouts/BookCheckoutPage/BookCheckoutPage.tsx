import { useEffect, useState } from "react"
import BookModel from "../../models/BookModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReview } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { LatestReviews } from "./LatestReviews";
import { useOktaAuth } from "@okta/okta-react";
import { error } from "console";

export const BookCheckoutPage = () => {

    const {authState} = useOktaAuth();

    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(false);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    // Has User Left a Review
    const [hasReviewLeft, setHasReviewLeft] = useState(false);
    const [isLoadingUserReview, setIsLoadingUserReview] = useState(true);

    // Number of Books Loaned State
    const [currentLoansCount, setCurrentLoansCount] = useState(0);
    const [isLoadingCurrentLoansCount, setIsLoadingCurrentLoansCount] = useState(true);

    //Is the Book Checked out State
    const [isBookCheckedOut, setIsBookCheckedOut] = useState(false);
    const [isLoadingBookChekedOut, setIsLoadingBookCheckedOut] = useState(true);

    // Take out the id from the path localhost:3000/checkout/5
    const bookId = (window.location.pathname).split('/')[2];

    //Fetch a Book
    useEffect(() => {
        const fetchBook = async () => {
            const baseUrl = "http://localhost:8080"
            const url = `${baseUrl}/api/books/${bookId}`

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error("Something went wrong while fetching the book Id: " + bookId);
            }

            const responeJSON = await response.json();

            const book: BookModel = {
                id: responeJSON.id,
                title: responeJSON.title,
                author: responeJSON.author,
                description: responeJSON.description,
                copies: responeJSON.copies,
                copiesAvailable: responeJSON.copiesAvailable,
                category: responeJSON.category,
                img: responeJSON.img
            }
            setBook(book);
            setIsLoading(false);

        }
        fetchBook().catch((error) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, [isBookCheckedOut]);

    //Fetch a Book Review byId
    useEffect(() => {
        const fetchBookReviews = async () => {
            const baseUrl = "http://localhost:8080/api/";
            const reviewsUrl = `${baseUrl}reviews/search/findByBookId?bookId=${bookId}`;
            const responseReviews = await fetch(reviewsUrl);
            if(!responseReviews.ok){
                throw new Error("Something went wrong while fetching reviews for boodId: " + bookId);
            }
            const responseReviewsJSON = await responseReviews.json();
            const responseReviewsData = responseReviewsJSON._embedded.reviews;
            const loadedReviews: ReviewModel[] = [];
            let weightedStarReviews: number = 0;

            for(const key in responseReviewsData){
                loadedReviews.push(
                    {
                        id: responseReviewsData[key].id,
                        userEmail: responseReviewsData[key].userEmail,
                        date: responseReviewsData[key].date,
                        rating: responseReviewsData[key].rating,
                        book_id: responseReviewsData[key].bookId,
                        reviewDescription: responseReviewsData[key].reviewDescription
                    }
                );
                weightedStarReviews = weightedStarReviews + responseReviewsData[key].rating; // set stars review copmonent based on rating
            }
            if (loadedReviews) { // round decimal point stars 
                const round = (Math.round((weightedStarReviews / loadedReviews.length) * 2) / 2).toFixed(1);
                setTotalStars(Number(round));
            }

            setReviews(loadedReviews);
            setIsLoadingReview(false);


        }

        fetchBookReviews().catch((error) => {
            setIsLoadingReview(false);
            setHttpError(error);
        })

    }, [hasReviewLeft]);

    // Fetch Number of Books Loaned by Current User
    useEffect(() => {
        const fetchUsersCurrentBookCount = async () => {

            if(authState && authState.isAuthenticated){
                const url = `http://localhost:8080/api/books/secure/currentloans/count`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const currentLoansCountResponse = await fetch(url, requestOptions);
                if(!currentLoansCountResponse.ok){
                    throw new Error("Something went wrong while fetching user's loan counts.")
                }
                const currentLoansCountResponseJSON = await currentLoansCountResponse.json();
                setCurrentLoansCount(currentLoansCountResponseJSON);
            }
            setIsLoadingCurrentLoansCount(false);

        }
        fetchUsersCurrentBookCount().catch((error: any) => {
            setIsLoadingCurrentLoansCount(false);
            setHttpError(error.message);

        })
    },[authState, isBookCheckedOut]);

    //Fetch User's Review left for a Book
    useEffect(() => {
        const fetchReviewLeftByUser = async () => {
            if(authState && authState.isAuthenticated){
                const url = `http://localhost:8080/api/reviews/secure/user/book?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    Headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const userReviewResponse = await fetch(url, requestOptions);
                console.log(userReviewResponse)
                if(!userReviewResponse.ok){
                    throw new Error("Something went wrong while fetching user's review for this book");
                }
                const userReviewResponseJSON = await userReviewResponse.json();
                setHasReviewLeft(userReviewResponseJSON);
            }
            setIsLoadingUserReview(false);

        }
        fetchReviewLeftByUser().catch((error: any) => {
            setIsLoadingUserReview(false);
            setHttpError(error.message);
        })
    }, [authState]);

    // Fetch If the book has been already checked out by current user 
    useEffect(() => {
        const fetchIsBookCheckedOut = async () => {
            if(authState && authState.isAuthenticated){
                const url = `http://localhost:8080/api/books/secure/ischeckedout/byuser?bookId=${bookId}`;
                const requestOptions = {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authState.accessToken?.accessToken}`,
                        'Content-Type': 'application/json'
                    }
                }
                const isBookCheckedOutResponse = await fetch(url, requestOptions);
                if(!isBookCheckedOutResponse.ok){
                    throw new Error("Something went wrong while checking if the user has already cheked out the book");
                }
                const isBookCheckedOutResponseJSON = await isBookCheckedOutResponse.json();
                setIsBookCheckedOut(isBookCheckedOutResponseJSON);
            }
            setIsLoadingBookCheckedOut(false);

        }
        fetchIsBookCheckedOut().catch((error: any) => {
            setIsLoadingBookCheckedOut(false);
            setHttpError(error.message);
        })
    }, [authState]);

    if (isLoading || 
        isLoadingReview || 
        isLoadingCurrentLoansCount || 
        isLoadingBookChekedOut ||
        isLoadingUserReview) {
        return (
            <SpinnerLoading />
        )
    }
    if (httpError) {
        return (
            <div className="container m-5">
                <p>Something went wrong while fetching the book Id: {bookId} === {httpError}</p>
            </div>
        )
    }
    // Checkout a book
    async function checkoutBook() {

        const url = `http://localhost:8080/api/books/secure/checkout?bookId=${book?.id}`;
        const requestOptions = {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${authState?.accessToken?.accessToken}`,
                'Content-Type': 'application/json'
            }
        }

        const checkoutBookResponse = await fetch(url, requestOptions);
        if(!checkoutBookResponse.ok){
            throw new Error("Something went wrong while checking out your book");
        }
        const checkoutBookResponseJSON = checkoutBookResponse.json();
        setIsBookCheckedOut(true);
        
    }

    return (
        <div>
            <div className='container d-none d-lg-block'>
                <div className='row mt-5'>
                    <div className='col-sm-2 col-md-2'>
                        {book?.img ?
                            <img src={book?.img} width='226' height='349' alt='Book' />
                            :
                            <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                                height='349' alt='Book' />
                        }
                    </div>
                    <div className='col-4 col-md-4 container'>
                        <div className='ml-2'>
                            <h2>{book?.title}</h2>
                            <h5 className='text-primary'>{book?.author}</h5>
                            <p className='lead'>{book?.description}</p>
                            <StarsReview rating={totalStars} size={32} />
                        </div>
                    </div>
                    <CheckoutAndReview book={book} mobile={false} currentLoansCount={currentLoansCount} 
                    isAuthenticated={authState?.isAuthenticated} isCheckedOut={isBookCheckedOut} 
                    checkoutBook={checkoutBook} isReviewLeft={hasReviewLeft}/>
                </div>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
            {/* Mobile version */}
            <div className='container d-lg-none mt-5'>
                <div className='d-flex justify-content-center align-items-center'>
                    {book?.img ?
                        <img src={book?.img} width='226' height='349' alt='Book' />
                        :
                        <img src={require('./../../Images/BooksImages/book-luv2code-1000.png')} width='226'
                            height='349' alt='Book' />
                    }
                </div>
                <div className='mt-4'>
                    <div className='ml-2'>
                        <h2>{book?.title}</h2>
                        <h5 className='text-primary'>{book?.author}</h5>
                        <p className='lead'>{book?.description}</p>
                        <StarsReview rating={totalStars} size={32} />
                    </div>
                </div>
                <CheckoutAndReview book={book} mobile={true} currentLoansCount={currentLoansCount} 
                isAuthenticated={authState?.isAuthenticated} isCheckedOut={isBookCheckedOut} 
                checkoutBook={checkoutBook} isReviewLeft={hasReviewLeft}/>
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
        </div>
    )
}