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
        <h1 className="trending">LOADING....</h1>
        <div className="movie-cards">
          {movies.map((movie) => (
            <img
              key={movie.id}
              src={movie.posterUrl}
              alt={movie.name}
              onClick={() => handlePosterClick(movie.id)}
              style={{ cursor: 'pointer' }}
            />
          ))}
        </div>
        {userData && (
          <div className="user-data">
            <h2>Welcome, {userData.username}!</h2>
            <p>Email: {userData.email}</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default Homepage;
