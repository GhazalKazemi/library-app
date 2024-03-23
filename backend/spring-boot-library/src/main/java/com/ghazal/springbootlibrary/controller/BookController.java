package com.ghazal.springbootlibrary.controller;

import com.ghazal.springbootlibrary.entity.Book;
import com.ghazal.springbootlibrary.service.BookService;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/books")
public class BookController {

    private BookService bookService;

    public BookController(BookService bookService){
        this.bookService = bookService;
    }

    @PutMapping("/secure/checkout") //will be secure in the future!
    public Book checkoutBook(@RequestParam Long bookId) throws Exception {
        String fakeUserEmail = "fakeUser@email.com";

        return bookService.checkoutBook(fakeUserEmail, bookId);
    }

    @GetMapping("/secure/ischeckoedout/byuser")
    public boolean checkoutBookByUser(@RequestParam Long bookId){
        String fakeUserEmail = "fakeUser@email.com";

        return bookService.checkoutBookByUser(fakeUserEmail, bookId);
    }


}
