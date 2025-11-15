# URL Shortener with Private Links

A full-stack URL shortener application with authentication and password-protected private links.

## Features

✅ **URL Shortening** - Convert long URLs into short, shareable links
✅ **Private Links** - Create password-protected links for sensitive content
✅ **User Authentication** - Signup and signin functionality
✅ **Analytics** - Track click counts and visit history
✅ **Server-Side Rendering** - Built with EJS templates

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB with Mongoose
- **View Engine**: EJS
- **Security**: bcryptjs for password hashing
- **ID Generation**: nanoid

## Usage

### Creating a Regular Short URL
1. Enter a long URL in the input field
2. Click "Shorten URL"
3. Copy the generated short link

### Creating a Private Link
1. Enter a long URL
2. Check "Make this a private link"
3. Enter a password
4. Click "Shorten URL"
5. Share both the link and password with authorized users

### Accessing a Private Link
1. Visit the short URL
2. Enter the password when prompted
3. Get redirected to the original URL

## Security Features

- Passwords are hashed using bcryptjs with salt rounds of 10
- Private links require password verification before redirect
- All user passwords are securely hashed in the database
- Input validation on all forms

## Project Structure

```
urlShortner/
├── controllers/
│   ├── auth.js       # Authentication logic
│   └── url.js        # URL shortening logic
├── models/
│   ├── auth.js       # User model
│   └── url.js        # URL model
├── routes/
│   ├── auth.js       # Auth routes
│   └── url.js        # URL routes
├── views/
│   ├── home.ejs      # Homepage
│   ├── signup.ejs    # Signup page
│   ├── signin.ejs    # Signin page
│   └── password-prompt.ejs  # Private link password page
├── public/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── main.js   # URL shortening logic
│       └── auth.js   # Authentication logic
├── lib/
│   └── mongo.js      # MongoDB connection
└── index.js          # Main server file
```
