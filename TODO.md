# Hotel Management MongoDB Integration TODO

## Completed Tasks
- [x] Install Mongoose for MongoDB connection
- [x] Create MongoDB connection utility (lib/mongodb.ts)
- [x] Create Customer model (lib/models/Customer.ts)
- [x] Create Room model (lib/models/Room.ts)
- [x] Create Booking model (lib/models/Booking.ts)
- [x] Create customers API routes (app/api/customers/route.ts)
- [x] Create rooms API routes (app/api/rooms/route.ts)
- [x] Create bookings API routes (app/api/bookings/route.ts)
- [x] Create .env.local with MongoDB URI
- [x] Test API endpoints with MongoDB
- [x] Update frontend components to fetch data from APIs
- [x] Add error handling and validation
- [x] Set up MongoDB database (user needs to install/start MongoDB locally or use cloud service)

## Notes
- Backend server runs on port 5000 with Express + MongoDB
- Frontend runs on port 3000 and fetches data from backend APIs
- MongoDB connection uses mongodb://localhost:27017/hotel_management
- Customer panel displays data from MongoDB via backend API
