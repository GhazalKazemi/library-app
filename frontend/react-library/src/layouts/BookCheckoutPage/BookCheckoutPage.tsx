import { useEffect, useState } from "react"
import BookModel from "../../models/BookModel"
import { SpinnerLoading } from "../Utils/SpinnerLoading";

export const BookCheckoutPage = () => {
    const [book, setBook] = useState<BookModel>();
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(false);
    // Take out the id from the path localhost:3000/checkout/5
    const bookId = (window.location.pathname).split('/')[2];
    useEffect(() => {
        const fetchBook = async () => {

        }
        fetchBook().catch((error) => {
            setIsLoading(false);
            setHttpError(error.message);
        });
    }, []);

    if(isLoading){
        return(
            <SpinnerLoading/>
        )
    }
    if(httpError){
        return(
            <div className="container m-5">
                <p>Something went wrong while fetching the book Id: {bookId} === {httpError}</p>
            </div>
        )
    }

    return (
        <div>

        </div>
    )
}