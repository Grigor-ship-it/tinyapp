# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs (à la bit.ly).

## Final Product

!["Screenshot of registration page"](https://github.com/Grigor-ship-it/tinyapp/blob/master/docs/urls-register.png?raw=true)
!["Screenshot of home page without any stored data"](https://github.com/Grigor-ship-it/tinyapp/blob/master/docs/urls-page-empty.png?raw=true)
!["Screenshot of page with stored data"](https://github.com/Grigor-ship-it/tinyapp/blob/master/docs/urls-page.png?raw=true)


## Dependencies

- Node.js
- Express
- EJS
- bcrypt
- body-parser
- cookie-session

## Getting Started

- Install all dependencies (using the `npm install` command).
- Run the development web server using the `node express_server.js` command.

## Current Features

- Users are able to register and compile their own list of shortened URLs which is stored in a database.
- App allows users to keep certain shortened URLs and update the long URL which is assigned to it.
- App allows users to alltogether delete user submitted URLs.
- App allows for users to be redirected to submitted sites via hyperlinks.

## Upcoming Features

- Hyper links on homepage which allows direct redirection.
- Hightened security which will allow email verification if log in was from different device/IP.
- Class system for user database to allow superclass to promote users as admin.
- Button to allow copy paste option instead of using keyboard shortcuts.