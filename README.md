# 🛍️ Campus Marketplace

![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=black)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Bootstrap](https://img.shields.io/badge/Bootstrap-7952B3?style=for-the-badge&logo=bootstrap&logoColor=white)

> A peer-to-peer second-hand marketplace web app for university students — built as a group project for COMP2750/6750 at Macquarie University. Students can sign in, browse listings from other users, shortlist items, and manage their own listings.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 Authentication | Firebase Auth — sign in required to browse or list items |

| 🛒 Marketplace | Browse all listings except your own, with category filtering |

| ❤️ Shortlist | Save and unsave items across sessions, persisted in Firestore |

| 📦 My Listings | View and manage items you have listed |

| ➕ Create Listing | Upload items with images, price, condition, and pickup details |

---

## 🛠️ Tech Stack

| Category | Technology |
|---|---|
| Frontend | HTML, CSS, Bootstrap, JavaScript |

| Backend / Database | Firebase Firestore |

| Authentication | Firebase Authentication |

| Deployment | Live Server (local) |

---

## 💡 My Contribution

I was responsible for the **Marketplace browsing page** (`marketplace.js` / `marketplace.html`):

- Queried the `items` Firestore collection and filtered out the current user's own listings
- 
- Applied JavaScript `map()` to transform raw Firestore documents into dynamically rendered product cards
- 
- Built the **shortlist (heart) feature** — reads from the `shortlist` collection on load to restore saved state, then conditionally writes or deletes records based on whether the item is already shortlisted
- 
- Implemented **category filter** buttons that re-render the listing without additional database calls
- 
- Handled Firebase `onAuthStateChanged` to gate all page logic behind authentication

---

## 🚀 How to Run

1. Clone the repo and open the project folder in VS Code

2. Install the **Live Server** extension if not already installed

3. Right-click `login.html` → **Open with Live Server**

4. Sign in with one of the test accounts below

> ⚠️ Do not open HTML files directly in the browser — Firebase requires a server origin to avoid CORS issues.

---

## 🔑 Test Accounts

| Email | Password |
|---|---|
| student_seller@students.mq.edu.au | Iwanttosellstuff |

| test@gmail.com | test123 |

| test1@gmail.com | test1234 |

---

## 👥 Group Members

| Name |
|---|
| Evan Walsh |

| Alan Chow |

| Angella Mutoni |

| Mark Cheng |

---

## 🎓 Context

This project was completed as Assessment Task 3 for COMP2750/6750 (Applications Modelling and Development) at Macquarie University, Session 1, 2026. The brief simulated a real client engagement — our group acted as a development team proposing and building a platform the university could theoretically adopt.
