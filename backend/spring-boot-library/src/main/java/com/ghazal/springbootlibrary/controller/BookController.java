package com.ghazal.springbootlibrary.controller;

import com.ghazal.springbootlibrary.entity.Book;
import com.ghazal.springbootlibrary.service.BookService;
import com.ghazal.springbootlibrary.utils.Constants;
import com.ghazal.springbootlibrary.utils.ExtractJWT;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private final BookService bookService;

    public BookController(BookService bookService){
        this.bookService = bookService;
    }

    @PutMapping("/secure/checkout") //will be secure in the future!
    public Book checkoutBook(@RequestHeader("Authorization") String token , @RequestParam Long bookId) throws Exception {
//        String fakeUserEmail = "fakeUser@email.com";
        String userEmail = ExtractJWT.payloadJWTExtraction(token, Constants.USER_EMAIL_SUB_KEY);
        return bookService.checkoutBook(userEmail, bookId);
    }

    @GetMapping("/secure/ischeckedout/byuser")
    public boolean checkoutBookByUser(@RequestHeader("Authorization") String token, @RequestParam Long bookId){
//        String fakeUserEmail = "fakeUser@email.com";
        String userEmail = ExtractJWT.payloadJWTExtraction(token, Constants.USER_EMAIL_SUB_KEY);
        return bookService.checkoutBookByUser(userEmail, bookId);
    }

    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@RequestHeader("Authorization") String token){
//        String fakeUserEmail = "fakeUser@email.com";

        String userEmail = ExtractJWT.payloadJWTExtraction(token, Constants.USER_EMAIL_SUB_KEY);

        return bookService.currentLoansCount(userEmail);
    }


}
