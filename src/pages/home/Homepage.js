import React, { useEffect, useState } from 'react';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { db } from '../../lib/firebase';
import userSessionStore from '../../lib/userSessionStore';
import Header from '../../components/header/Header';
import './Homepage.css';

const Homepage = () => {
  const [movies, setMovies] = useState([]);
  const [userData, setUserData] = useState(null); 
  const user = userSessionStore((state) => state.user); 
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const moviesCollectionRef = collection(db, 'movies');
        const snapshot = await getDocs(moviesCollectionRef);
        const moviesList = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setMovies(moviesList);
      } catch (error) {
        console.error('Error fetching movies:', error);
      }
    };

    const fetchUserData = async () => {
      if (user?.uid) {
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const userDoc = await getDoc(userDocRef);
          console.log(userDoc.data())

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

    fetchMovies();
    fetchUserData();
  }, [user?.uid]);

  const handlePosterClick = (id) => {
    navigate(`/moviedetail/${id}`);
  };

  return (
    <div>
      <Header />
      <main>
        <section className="user-welcome">
          {userData && (
            <div className="user-data-card">
              <div className="user-info">
                <h2>{userData.username}</h2>
                <span className="welcome-message">Welcome Back!</span>
              </div>
            </div>
          )}
        </section>

        <section className="movie-section">
          <h1 className="trending">Trending Movies</h1>
          <div className="movie-cards">
            {movies.map((movie) => (
              <div key={movie.id} className="movie-card">
                <img
                  src={movie.posterUrl}
                  alt={movie.name}
                  onClick={() => handlePosterClick(movie.id)}
                />
                <div className="movie-overlay">
                  <h3>{movie.name}</h3>
                  <p>{movie.genre}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
