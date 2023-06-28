Live Site: [Quoted](https://creative-shortbread-cb498b.netlify.app/)

[![Netlify Status](https://api.netlify.com/api/v1/badges/1d8db880-48b8-4297-bc78-8081a66320f8/deploy-status)](https://app.netlify.com/sites/creative-shortbread-cb498b/deploys)

# Quoted: A Quote Sharing Web App

Quoted is a web application built with Next.js and Firebase. It's a platform where users can share their favorite quotes with others, view quotes from different users, and like the ones that inspire them.

## Features

### Account Creation and Profile Management

Quoted allows users to create an account for themselves. Upon registration, users can edit their basic information and upload a profile picture. If no profile picture is provided, a default placeholder image is used.

### Quote Sharing

Users can upload their favorite quotes to the app for everyone to see. Each entry contains:
- The quote text
- The name of the author (user who posted)
- Profile picture of the author
- Timestamp of when the quote was created

### Homepage and Quote Feed

The homepage displays all the quotes ever written on the app in descending order of their timestamp. The most recent quote is always at the top, giving users fresh content whenever they visit the app.

### User Authentication

In order to use the features of the app, users must be logged in. This ensures that only registered users can post quotes and interact with existing quotes.

### Quote Editing and Deletion

Users have the ability to edit and delete the quotes they've posted. This ensures that users maintain control over their content and can easily make changes as they see fit.

### Likes and Interactions

As a bonus feature, users can like the quotes posted by others. Each quote displays the number of likes received, adding a social dimension to the app and enabling users to interact with the content.

## Technical Overview

Quoted integrates with Firebase's Firestore for all data storage needs. All users and quotes are stored in Firestore, and CRUD operations are extensively used for implementing various features.

For profile picture uploads, Firebase's Storage is utilized. This ensures efficient and secure handling of user-uploaded images.

The app is built using the Next.js framework, a powerful tool for developing modern web applications.

## Mobile-First Approach

Quoted is designed with a mobile-first approach. It is fully mobile-responsive, ensuring that users on all kinds of devices can access and use the app seamlessly.

## Creativity and Freedom

This app is designed with a focus on creativity and freedom. Users are free to share any quotes they like, and the design and feature set offer a unique and engaging user experience.
