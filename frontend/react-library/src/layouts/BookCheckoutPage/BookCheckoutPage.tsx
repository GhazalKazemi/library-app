import { useEffect, useState } from "react"
import BookModel from "../../models/BookModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading";
import { StarsReview } from "../Utils/StarsReview";
import { CheckoutAndReview } from "./CheckoutAndReviewBox";
import ReviewModel from "../../models/ReviewModel";
import { error } from "console";
import { LatestReviews } from "./LatestReviews";

export const BookCheckoutPage = () => {
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(false);

    // Review State
    const [reviews, setReviews] = useState<ReviewModel[]>([]);
    const [totalStars, setTotalStars] = useState(0);
    const [isLoadingReview, setIsLoadingReview] = useState(true);

    // Take out the id from the path localhost:3000/checkout/5
    const bookId = (window.location.pathname).split('/')[2];
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
    }, []);

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

    }, []);

    if (isLoading || isLoadingReview) {
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
                    <CheckoutAndReview book={book} mobile={false} />
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
                <CheckoutAndReview book={book} mobile={true} />
                <hr />
                <LatestReviews reviews={reviews} bookId={book?.id} mobile={false} />
            </div>
        </div>
    )
}