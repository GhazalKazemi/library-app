package com.ghazal.springbootlibrary.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "book")
@Data
public class Book {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Integer id;
    @Column(name = "title")
    private String title;
    @Column(name = "author")
    private String author;

    @Column(name = "copies")
    private String copies;

    @Column(name = "copies_available")
    private String copiesAvailable;
    @Column(name = "description")
    private String description;

    @Column(name = "category")
    private String category;
    @Column(name = "img")
    private String image;
}