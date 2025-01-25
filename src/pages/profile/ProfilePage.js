import React, { useEffect, useState } from 'react';
import Header from '../../components/header/Header';
import './ProfilePage.css';
import userSessionStore from '../../lib/userSessionStore';
import { getDoc, doc, getDocs, collection } from 'firebase/firestore';
import { db } from '../../lib/firebase';

// StarRating component for displaying stars
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

const ProfilePage = () => {
  const [userData, setUserData] = useState(null);
  const [movies, setMovies] = useState([]);
  const user = userSessionStore((state) => state.user);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          console.log(userDoc.data());

          if (userDoc.exists()) {
            setUserData(userDoc.data());
          } else {
            console.error('User not found!');
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
        }
      }
    };

    fetchUserData();
  }, [user?.uid]);

  // Fetch movie posters based on movieId
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesSnapshot = await getDocs(collection(db, 'movies'));
        const movieList = moviesSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setMovies(movieList);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    fetchMovies();
  }, []);

  if (!userData) {
    return <div>Loading...</div>;
  }

  const moviesWatched = userData?.reviews?.filter(review => review.movieWatched);
  const moviesReviewed = userData?.reviews?.filter(review => review.review);

  // Get posterUrl for a given movieId
  const getMoviePoster = (movieId) => {
    const movie = movies.find(movie => movie.id === movieId);
    return movie ? movie.posterUrl : "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png";
  };

  return (
    <div className="profile-page-root">
      <Header />
      <main className="profile-page-main">
        <div className="profile-page-top">
          <div className="profile-page-top-left">
            <img
              src="https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"
              alt="Profile" className="profile-photo"
            />
            <h1 className="profile-page-username">{userData?.username || 'USERNAME'}</h1>
          </div>
          <div className="profile-page-top-right">
            <div>
              <h1>{moviesWatched?.length || 0}</h1>
              <p>Movies Watched</p>
            </div>
            <div>
              <h1>{moviesReviewed?.length || 0}</h1>
              <p>Movies Reviewed</p>
            </div>
          </div>
        </div>
        <div className="profile-page-movies-watched">
          <h1>MOVIES WATCHED</h1>
          <div className="profile-page-movies-watched-grid">
            {moviesWatched?.map((review, index) => (
              <img key={index} src={getMoviePoster(review.movieId)} alt={review.movieTitle || 'Movie'} />
            ))}
          </div>
        </div>
        <div className="profile-page-movies-reviewed">
          <h1>MOVIES REVIEWED</h1>
          <div className="profile-page-movies-reviewed">
            {moviesReviewed?.map((review, index) => (
              <div key={index} className="profile-page-movies-reviewed-review-box">
                <div className="profile-page-movies-reviewed-review-box-top-layer">
                  <img
                    className="profile-page-movies-reviewed-pfp"
                    src={userData.profilePicture || "https://www.pngall.com/wp-content/uploads/5/User-Profile-PNG-High-Quality-Image.png"}
                    alt="profile"
                  />
                  <p>Review By <b>{userData.username}</b></p>
                </div>
                <div className="profile-page-movies-reviewed-review-box-bottom-layer">
                  <img src={getMoviePoster(review.movieId)} alt={review.movieTitle || 'Movie'} />
                  <div className="profile-page-movies-reviewed-review-box-bottom-layer-right">
                  <p>{review.review}</p>
                  <div className="review-rating">
                    <StarRating stars={review.stars || 0} />
                  </div>
                  </div>
                </div>
                <p className="profile-page-movies-reviewed-date">
                  Date Added: {new Date(review.reviewDate).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
