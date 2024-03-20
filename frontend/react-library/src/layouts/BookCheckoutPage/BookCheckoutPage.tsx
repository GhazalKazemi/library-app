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
            const baseUrl = "http://localhost:8080"
            const url = `${baseUrl}/api/books/${bookId}`

            const response = await fetch(url);

            if(response.ok){
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