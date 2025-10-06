// ===============================
// 📚 PLP Bookstore - queries.js
// ===============================

// ===============================
// Task 1: MongoDB Setup
// ===============================

// Switch to (or create) the database
use plp_bookstore

// Create the books collection
db.createCollection("books")

// ===============================
// Task 2: Basic CRUD Operations
// ===============================

// 1. Find all books in a specific genre (example: Fiction)
db.books.find({ genre: "Fiction" })

// 2. Find books published after a certain year (example: 2010)
db.books.find({ published_year: { $gt: 2010 } })

// 3. Find books by a specific author (example: Harper Lee)
db.books.find({ author: "Harper Lee" })

// 4. Update the price of a specific book
db.books.updateOne(
  { title: "To Kill a Mockingbird" },
  { $set: { price: 15.99 } }
)

// 5. Delete a book by its title
db.books.deleteOne({ title: "To Kill a Mockingbird" })

// ===============================
// Task 3: Advanced Queries
// ===============================

// 1. Find books that are both in stock and published after 2010
db.books.find({ in_stock: true, published_year: { $gt: 2010 } })

// 2. Projection - return only title, author, and price fields
db.books.find(
  {},
  { title: 1, author: 1, price: 1, _id: 0 }
)

// 3. Sort books by price - Ascending (lowest to highest)
db.books.find().sort({ price: 1 })

// 4. Sort books by price - Descending (highest to lowest)
db.books.find().sort({ price: -1 })

// 5. Pagination (5 books per page)
// Page 1
db.books.find().sort({ price: 1 }).skip(0).limit(5)
// Page 2
db.books.find().sort({ price: 1 }).skip(5).limit(5)
// Page 3
db.books.find().sort({ price: 1 }).skip(10).limit(5)

// ===============================
// Task 4: Aggregation Pipelines
// ===============================

// 1. Calculate the average price of books by genre
db.books.aggregate([
  { $group: { _id: "$genre", avgPrice: { $avg: "$price" } } }
])

// 2. Find the author with the most books
db.books.aggregate([
  { $group: { _id: "$author", totalBooks: { $sum: 1 } } },
  { $sort: { totalBooks: -1 } },
  { $limit: 1 }
])

// 3. Group books by publication decade and count them
db.books.aggregate([
  {
    $project: {
      decade: { $subtract: [ "$published_year", { $mod: [ "$published_year", 10 ] } ] }
    }
  },
  { $group: { _id: "$decade", count: { $sum: 1 } } },
  { $sort: { _id: 1 } }
])

// ===============================
// Task 5: Indexing
// ===============================

// 1. Create an index on the title field
db.books.createIndex({ title: 1 })

// 2. Create a compound index on author and published_year
db.books.createIndex({ author: 1, published_year: 1 })

// 3. Use explain() to show performance improvement
db.books.find({ title: "To Kill a Mockingbird" }).explain("executionStats")
