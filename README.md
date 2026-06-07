# Campus Marketplace
**COMP2750/6750 – Assessment Task 3**
Group 37 | Macquarie University | Session 1, 2026

---

## Group Members
- Evan Walsh
- Alan Chow
- Angella Mutoni
- Mark Cheng

---

## Project Overview
Campus Marketplace is a web application that allows Macquarie University students to sign in, browse items listed by other students, view their own listings, and shortlist items they are interested in.

Built with HTML, CSS (Bootstrap), JavaScript, and Firebase (Authentication + Firestore).

---

## File Structure
```
MARKET/
├── images/               # Product images
├── app.js                # Firebase login logic
├── marketplace.js        # Marketplace page logic
├── shortlist.js          # Shortlist page logic
├── login.html            # Sign-in page
├── index.html            # Welcome page
├── marketplace.html      # Browse marketplace page
├── mylistings.html       # User's own listings page
├── shortlist.html        # User's shortlisted items page
├── Create_new_list2.html # Create new listing page
├── marketplace.css       # Marketplace styles
├── style.css             # Global styles
└── README.md             # This file
```

---

## How to Run
1. Open the project folder in VS Code
2. Install the **Live Server** extension if not already installed
3. Right-click `login.html` and select **Open with Live Server**
4. Sign in using one of the test accounts below

---

## Firebase Configuration
**Project ID:** `comp6750-group37`
**Auth Domain:** `comp6750-group37.firebaseapp.com`

```javascript
const firebaseConfig = {
    apiKey: "AIzaSyAORO77__I2SHOVVB3ByHIi6wIhQQu_7-8",
    authDomain: "comp6750-group37.firebaseapp.com",
    projectId: "comp6750-group37",
    storageBucket: "comp6750-group37.firebasestorage.app",
    messagingSenderId: "104909862405",
    appId: "1:104909862405:web:d7d191fe2f30233a880e6c"
};
```

---

## Test User Accounts

| Email | Password | User ID |
|-------|----------|---------|
| student_seller@students.mq.edu.au | Iwanttosellstuff | 61gUSEy6RERw9P5RxXBCi9nSIGw2 |
| ewtesting@outlook.com | ewtesting | sKXlPpW7rEUZjxegqBWVzw97ujv2 |
| hello@world.got | hellokitty | SxlH5utRLCbbBIgpWhE8QM8xMow1 |
| test2@gmail.com | test1234 | C2z777jbwGNpemwAaxmFHdZDjKl2 |
| test1@gmail.com | test1234 | FmkkLBfSfoO9pJlKIE1AjamLWZm1 |
| test@gmail.com | test123 | hKRViESqbTgSIoMBweVSAYar9vk1 |

---

## Firestore Collections
- items — All product listings. Each document contains: productName, description, price, category, condition, imageUrls (array), userEmail, userId, location, pickupDate, pickupTime, createdAt
- shortlist — Shortlisted items per user. Each document contains: userId, itemId

---

## Notes
- Do **not** open HTML files directly in the browser. Always use **Live Server** to avoid Firebase CORS issues.
- Users cannot see their own listings in the Marketplace page.
- Users cannot shortlist their own items.
- All data is loaded dynamically from Firestore — no hardcoded items in the HTML.