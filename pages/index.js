import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase";
import { getDocs, collection } from "firebase/firestore";
import styles from '../styles/Home.module.css';
import Quote from '../components/Quote';
import Head from 'next/head';
import Login from '../components/Login';
import Signup from '../components/Signup';
import Modal from '../components/Modal';
import { TransitionGroup, CSSTransition } from "react-transition-group";

export default function Home() {
  const [quotes, setQuotes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0);

  useEffect(() => {
    const getQuotes = async () => {
      const querySnapshot = await getDocs(collection(db, 'quotes'));
      setQuotes(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    };
    getQuotes();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length);
    }, 2750); // Changed to 1.5 seconds

    return () => {
      clearInterval(intervalId);
    };
  }, [quotes]);

  return (
    <div className={styles.container}>
      <Head>
        <title>"Quoted"</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className={styles.header}>
      <h1 className={styles.description}> Welcome to Quoted!</h1>
        <div className={styles.description}>
        <button onClick={() => {setShowModal(true); setIsLogin(true);}}>Login</button>
        <button onClick={() => {setShowModal(true); setIsLogin(false);}}>Sign Up</button>
        </div>
      </header>

      {showModal && (
        <Modal onClose={() => setShowModal(false)}>
          {isLogin ? (
            <Login onSwitch={() => setIsLogin(false)} />
          ) : (
            <Signup onSwitch={() => setIsLogin(true)} />
          )}
        </Modal>
      )}

      <main className={styles.main}>
       

        <p className={styles.description}>
          Explore a universe of quotes. Share your favorites and discover new ones.
        </p>

        <div className={styles.quoteContainer}>
          <TransitionGroup>
            {quotes.map((quote, index) => {
              const isActive = index === currentQuoteIndex;
              const isPrev = (index === currentQuoteIndex - 1) || (currentQuoteIndex === 0 && index === quotes.length - 1);
              const isNext = (index === currentQuoteIndex + 1) || (currentQuoteIndex === quotes.length - 1 && index === 0);
              return (
                <CSSTransition
                  in={isActive}
                  timeout={1000}
                  classNames="quote"
                  unmountOnExit
                  key={index}
                >
                  <div className={`${styles.quote} ${isActive ? styles.active : isPrev ? styles.prev : isNext ? styles.next : styles.hidden}`}>
                    <Quote quote={quote} />
                  </div>
                </CSSTransition>
              );
            })}
          </TransitionGroup>
        </div>
      </main>

      <footer className={styles.footer}>

      </footer>
    </div>
  );
}
