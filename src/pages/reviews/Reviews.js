import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import Header from '../../components/header/Header';
import './Reviews.css';

// Component for Star Rating
const StarRating = ({ stars }) => {
  const MAX_STARS = 5;

  return (
    <div className="star-rating">
      {[...Array(MAX_STARS)].map((_, index) => (
        <span key={index} className={index < stars ? 'star filled' : 'star'}>
          &#9733;
        </span>
      ))}
    </div>
  );
};

const Reviews = ({ currentUserId }) => {
  const [reviews, setReviews] = useState([]);

  const fetchReviews = async () => {
    try {
      const usersQuery = query(collection(db, 'users'));
      const userDocs = await getDocs(usersQuery);
      const fetchedReviews = [];

      for (const userDoc of userDocs.docs) {
        const userData = userDoc.data();
        const userId = userDoc.id;

        // Skip current user’s reviews
        if (userId !== currentUserId && Array.isArray(userData.reviews)) {
          for (const review of userData.reviews) {
            try {
              const movieDoc = await getDoc(doc(db, 'movies', review.movieId));
              const movieData = movieDoc.exists() ? movieDoc.data() : {};

              fetchedReviews.push({
                ...review,
                username: userData.username || 'Unknown',
                userProfilePic:
                  userData.profilePic ||
                  'https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png',
                moviePoster: movieData.posterUrl || '',
              });
            } catch (movieError) {
              console.error(`Error fetching movie details for movieId: ${review.movieId}`, movieError);
            }
          }
        }
      }

      setReviews(fetchedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [currentUserId]); // Add currentUserId as a dependency to re-fetch if it changes

  return (
    <div className="reviews-root">
      <Header />
      <h1 className="suggested-reviews">Suggested Reviews</h1>
      <main className="reviews-main">
        <div className="review-grid">
          {reviews.map((review, index) => (
            <div className="review-box" key={index}>
              <div className="top-layer">
                <img className="pfp" src={review.userProfilePic} alt="profile" />
                <p>
                  Review By <b>{review.username}</b>
                </p>
              </div>
              <div className="bottom-layer">
                <img src={review.moviePoster || ''} alt="Movie Poster" className="movie-poster" />
                <div className="review-text">
                  <p>{review.review || 'No review text provided.'}</p>
                  <div>
                    <strong>Rating:</strong>
                    <StarRating stars={review.stars || 0} />
                  </div>
                </div>
              </div>
              <p className="date">
                Date Added: {review.reviewDate ? new Date(review.reviewDate).toLocaleDateString() : 'Unknown'}
              </p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default Reviews;
