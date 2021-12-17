const { book } = require('../models');
const { isAuthorized } = require('./tokenFunctions');

module.exports = {
  list: (req, res) => {
    const data = isAuthorized(req);
    if (!data) {
      res.status(401).json({ message: 'Invalid user' });
    } else {
      book.list(data.id, (error, bookList) => {
        if (error) {
          res.status(500).json({ message: 'Server Error' });
        } else {
          res.json({ message: 'OK', data: { book_list: bookList } });
        }
      });
    }
  },
  reviews: (req, res) => {
    const data = isAuthorized(req);
    const { book_id } = req.params;
    if (!data) {
      res.status(401).json({ message: 'Invalid user' });
    } else {
      book.reviews(data.id, book_id, (error, reviewList) => {
        if (error) {
          res.status(500).json({ message: 'Server Error' });
        } else {
          const book_data = {
            title: reviewList[0].title,
            thumbnail: reviewList[0].thumbnail,
          };
          const temp = {};
          reviewList.forEach((reviewData) => {
            const { review_id, page, created_at, review } = reviewData;
            if (!temp[page]) {
              temp[page] = { page, reviews: [] };
            }
            temp[page].reviews.push({ review_id, created_at, review });
          });
          const review_list = Object.values(temp);
          res.json({ message: 'OK', data: { book_data, review_list } });
        }
      });
    }
  },
};