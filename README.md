Auction Platform

A full-stack Auction Platform that supports auction creation, bidding, automatic expiry handling, and winner declaration.
The project is built using React (frontend), Node.js + Express (backend), and MongoDB (database).

Tech Stack
Frontend

React (Vite)

JavaScript

Fetch API

Backend

Node.js

Express.js

MongoDB

Mongoose

Tools

Postman (API testing)

Nodemon (auto-restart server)

Project Setup
Frontend Setup

The frontend was initialized using Vite:

npm create vite@latest

Framework selected:

React

Variant: JavaScript

Backend Setup

Initialize backend project:

npm init -y

Create a .env file to store environment variables such as the server port number.

Install required dependencies:

npm install express mongoose dotenv cors
Packages Used
Package	Purpose
express	Server and API creation
mongoose	Connect and interact with MongoDB
dotenv	Load environment variables from .env
cors	Allow frontend to communicate with backend

Install nodemon for development:

npm install --save-dev nodemon

Purpose: Automatically restarts the server when files change.