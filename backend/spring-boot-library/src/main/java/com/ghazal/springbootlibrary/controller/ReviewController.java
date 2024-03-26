package com.ghazal.springbootlibrary.controller;

import com.ghazal.springbootlibrary.requestmodels.ReviewRequest;
import com.ghazal.springbootlibrary.service.ReviewService;
import com.ghazal.springbootlibrary.utils.Constants;
import com.ghazal.springbootlibrary.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;


@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/reviews")
public class ReviewController {

    private ReviewService reviewService;
    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    @PostMapping("/secure")
    public void postReview(@RequestHeader("Authorization") String token,
                           @RequestBody ReviewRequest reviewRequest) throws Exception {
        String userEmail = ExtractJWT.payloadJWTExtraction(token, Constants.USER_EMAIL_SUB_KEY);
        System.out.println("Extracted user email " + userEmail);
        if (userEmail == null) {
            throw new Exception("User email does not exist.");
        }
        reviewService.postReview(userEmail, reviewRequest);

    }
}
