// src/environment.js

let baseUrl = "";

if (process.env.NODE_ENV === "production") {
  // Render backend ka URL
  baseUrl = "https://e-commerce-backend-mxhd.onrender.com";
} else {
  // Local development
  baseUrl = "http://localhost:5000";
}

export { baseUrl };

export const stripePublishableKey = "pk_test_51RcPdGGd8yfmOEEK0l9c8eBdLAQCkERmaTRWsk3t7lZAp49AcyYmyXmDld9pKp56eNIQGGJdFaeONkWnOxMHOqSy00c9Ji2AfQ"