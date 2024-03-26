package com.ghazal.springbootlibrary.service;

import com.ghazal.springbootlibrary.dao.BookRepository;
import com.ghazal.springbootlibrary.dao.ReviewRepository;
import com.ghazal.springbootlibrary.entity.Review;
import com.ghazal.springbootlibrary.requestmodels.ReviewRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.time.LocalDate;
import java.util.Objects;

@Service
@Transactional
public class ReviewService {

    private ReviewRepository reviewRepository;

    public ReviewService( ReviewRepository reviewRepository) {
        this.reviewRepository = reviewRepository;
    }

    public void postReview(String userEmail, ReviewRequest reviewRequest) throws Exception {
        Review validateReview = reviewRepository.findByUserEmailAndBookId(userEmail, reviewRequest.getBookId());
        if(validateReview != null){
            throw new Exception("Review already exists");
        }

        Review review = new Review();
        review.setRating(reviewRequest.getRating());
        review.setBookId(reviewRequest.getBookId());
        review.setUserEmail(userEmail);
        if(reviewRequest.getReviewDescription().isPresent()){
            review.setReviewDescription(reviewRequest.getReviewDescription().map(
                    Objects::toString
            ).orElse(null));
        }
        review.setDate(Date.valueOf(LocalDate.now()));
        reviewRepository.save(review);
    }
    public Boolean findAllReviewsByUser(String userEmail, Long bookId){
        Review reviewByUser = reviewRepository.findByUserEmailAndBookId(userEmail, bookId);
        if( reviewByUser != null){
            return true;
        }else {
            return false;
        }
    }
}
