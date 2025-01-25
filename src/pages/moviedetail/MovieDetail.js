import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc, arrayUnion, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../lib/firebase';
import { toast } from 'react-toastify';
import Header from '../../components/header/Header';
import './MovieDetail.css';

const MovieDetail = () => {
  const { id: movieId } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [watched, setWatched] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [reviewText, setReviewText] = useState('');

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const movieDocRef = doc(db, 'movies', movieId);
        const movieDoc = await getDoc(movieDocRef);

        if (movieDoc.exists()) {
          setMovie(movieDoc.data());
        } else {
          console.error('Movie not found!');
        }
      } catch (error) {
        console.error('Error fetching movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    if (movieId) {
      fetchMovieDetails();
    }
  }, [movieId]);

  const handleLikeToggle = () => {
    setLiked(!liked);
  };

  const handleWatchedToggle = () => {
    setWatched(!watched);
  };

  const handleStarClick = (starValue) => {
    setRating(starValue);
  };

  const handleStarHover = (starValue) => {
    setHoverRating(starValue);
  };

  const handleStarMouseLeave = () => {
    setHoverRating(0);
  };

  const addReview = async () => {
    if (!rating || !reviewText.trim()) {
      alert('Please provide a rating and a review.');
      return;
    }

    const auth = getAuth();
    const userId = auth.currentUser?.uid;

    if (!userId) {
      alert('User not authenticated. Please log in.');
      return;
    }

    const review = {
      movieId,
      review: reviewText,
      reviewDate: new Date().toISOString(),
      stars: rating,
      movieWatched: watched,
      movieLiked: liked,
    };

    try {
      const userDocRef = doc(db, 'users', userId);
      await updateDoc(userDocRef, {
        reviews: arrayUnion(review),
      });
      toast.success("Review Submitted Successfully")
      setReviewText('');
      setRating(0);
      setWatched(false);
      setLiked(false);
    } catch (error) {
      console.error('Error submitting review:', error);
      alert('Failed to submit review. Please try again later.');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!movie) {
    return <div>Movie not found.</div>;
  }

  return (
    <div>
      <Header />
      <main className="movie-detail-main">
        <div className="movie-detail-banner">
          <img src={movie.bannerUrl} alt={movie.name} />
        </div>
        <div className="movie-detail-bottom-section">
          <div className="movie-detail-poster">
            <img src={movie.posterUrl} alt={movie.name} />
          </div>
          <div className="movie-detail-information">
            <h1>{movie.name}</h1>
            <p>{movie.plotline}</p>
            <h2>Release Date: {movie.releaseDate}</h2>
            <h2>Directed by: {movie.director}</h2>
            <h2>Duration: {movie.duration}</h2>
          </div>
          <div className="movie-detail-review">
            <div className="movie-detail-review-first">
              <label className="movie-detail-watched">
                <span>Watched</span>
                <div
                  className={`movie-detail-watched-toggle ${watched ? 'active' : ''}`}
                  onClick={handleWatchedToggle}
                >
                  <span className="movie-detail-watched-slider"></span>
                </div>
              </label>
              <button
                className={`movie-detail-liked-button ${liked ? 'liked' : ''}`}
                onClick={handleLikeToggle}
              >
                {liked ? '❤️ Liked' : '🤍 Like'}
              </button>
            </div>
            <div className="movie-detail-review-second">
              <h1>Rate the Movie</h1>
              <div className="star-rating">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    className={`star ${(hoverRating || rating) >= star ? 'filled' : ''}`}
                    onClick={() => handleStarClick(star)}
                    onMouseEnter={() => handleStarHover(star)}
                    onMouseLeave={handleStarMouseLeave}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <div className="movie-detail-review-third">
              <input
                type="text"
                className="input-box"
                placeholder="Write your review here"
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
            </div>
            <div className="movie-detail-review-forth">
              <button className="submit-review-button" onClick={addReview}>
                Submit Review
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MovieDetail;
