# ✈️ Flight Booking System - Backend

This is the backend service for the **Flight Booking System**. It provides RESTful APIs to manage flights, bookings, and passengers. Built with **Node.js**, **Express**, and **MongoDB**.

## 📌 Features

* View available flights
* Get flight details
* Book seats with seat validation
* Store and fetch booking details
* MongoDB-based persistent data storage

## 🛠️ Tech Stack

* **Node.js**
* **Express**
* **MongoDB** with **Mongoose**
* [dotenv](https://www.npmjs.com/package/dotenv) - For managing environment variables
* [CORS](https://www.npmjs.com/package/cors) - For handling Cross-Origin Resource Sharing
* [body-parser](https://www.npmjs.com/package/body-parser) - For parsing request bodies

## 📁 Folder Structure


flight-system-be/

├── controllers/     # Business logic

├── models/          # Mongoose schemas

├── routes/          # API route definitions

├── config/          # DB connection setup

├── .env             # Environment variables

├── server.js        # App entry point

└── package.json



## ⚙️ Installation & Setup

### 1. Prerequisites

* [Node.js](https://nodejs.org/en/) (version >= 12)
* [MongoDB](https://www.mongodb.com/) (Community Edition or a cloud-based service like MongoDB Atlas)

### 2. Clone the Repository


git clone https://github.com/amitmungare/flight-system-be.git

cd flight-system-be


### 3. Install Dependencies


npm install


### 4. Configure Environment Variables

Create a `.env` file in the root directory with the following content:


PORT=5050

MONGO_URI=mongodb://localhost:27017/flight-system


Replace the `MONGO_URI` with your actual MongoDB connection string.  This might involve:

* A local MongoDB instance (as shown above)
* A cloud-based MongoDB Atlas connection string
* Any other valid MongoDB connection string

### 5. Run the Server


npm run dev


The server will be running at: `http://localhost:5050`

## 📬 API Endpoints

**Flights**

| Method | Endpoint                                                                                                 | Description                                                                                             |
| :----- | :------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------- |
| GET    | `/api/v1/flights/search?origin={}&destination={}&departureDate={}&passengers={}`                         | Search for flights based on origin, destination, departure date, and number of passengers                |
| GET    | `/api/v1/flights/:id`                                                                                      | Get flight details by ID                                                                                    |

**Bookings**

| Method | Endpoint                      | Description                                                                  |
| :----- | :---------------------------- | :--------------------------------------------------------------------------- |
| POST   | `/api/v1/bookings`            | Book a flight with passenger details and seat selection                       |
| GET    | `/api/v1/bookings`            | Retrieve all bookings for the authenticated user                            |
| GET    | `/api/v1/bookings/:id`        | Get a booking by its ID                                                      |
| PUT    | `/api/v1/bookings/:id`        | Update a booking by its ID                                                   |
| DELETE | `/api/v1/bookings/:id`        | Delete a booking by its ID                                                   |

**Users**

| Method | Endpoint                      | Description                                                              |
| :----- | :---------------------------- | :----------------------------------------------------------------------- |
| POST   | `/api/v1/auth/register`         | Register a new user                                                          |
| POST   | `/api/v1/auth/login`            | Authenticate a user and receive a JWT token for accessing protected routes |
| POST   | `/api/v1/auth/logout`           | Logout a user                                                              |


## 🧑‍💻 Author

Amit Mungare

* GitHub: [@amitmungare](https://github.com/amitmungare)
