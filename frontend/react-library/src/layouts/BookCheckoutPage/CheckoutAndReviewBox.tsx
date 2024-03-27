import React from "react";
import BookModel from "../../models/BookModel";
import { Link } from "react-router-dom";
import { LeaveAReview } from "../Utils/LeaveAReview";

export const CheckoutAndReview: React.FC<{book: BookModel | undefined, mobile: boolean, currentLoansCount: number, 
isAuthenticated: any, isCheckedOut: boolean, checkoutBook: any, isReviewLeft: boolean}> = (props) => { 
    function renderSignInButton() {
        if(props.isAuthenticated){
            if(!props.isCheckedOut && props.currentLoansCount < 5){
                return(<button className="btn btn-success btn-lg" onClick={() => props.checkoutBook()}>Checkout</button>)
            }else if(props.isCheckedOut){
                return(<p><b>Book checked out, enjoy!</b></p>)
            }else if(!props.isCheckedOut){
                return(<p className="danger">Too many books checked out.</p>)
            }
        }
        return(<Link to={'/login'} className="btn btn-success btn-lg">Sign in</Link>)
    }
    function renderUserReview(){
        if(props.isAuthenticated && !props.isReviewLeft){
            return(
                <LeaveAReview />
            )
        }else if(props.isAuthenticated && props.isReviewLeft){
            return(
                <p>
                    <b>Thank you for your review.</b>
                </p>
            )
        }
        return(
            <div>
                <hr/>
                <p>Sing in to be able to leave a review.</p>
            </div>
        )
    }
    return(
        <div className={props.mobile ? 'card d-flex mt-5' : 'card col-3 container d-flex mb-5'}>
            <div className='card-body container'>
                <div className='mt-3'>
                    <p>
                        <b>{props.currentLoansCount}/5 </b>
                        books checked out
                    </p>
                    <hr />
                    {props.book && props.book.copiesAvailable && props.book.copiesAvailable > 0 ?
                        <h4 className='text-success'>
                            Available
                        </h4>
                        :
                        <h4 className='text-danger'>
                            Wait List
                        </h4>
                    }
                    <div className='row'>
                        <p className='col-6 lead'>
                            <b>{props.book?.copies} </b>
                            copies
                        </p>
                        <p className='col-6 lead'>
                            <b>{props.book?.copiesAvailable} </b>
                            available
                        </p>
                    </div>
                </div>
                {renderSignInButton()}

                <hr />
                <p className='mt-3'>
                    This number can change until placing order has been complete.
                </p>
                {renderUserReview()}
            </div>
        </div>
    );
}