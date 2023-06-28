import React, { useEffect, useState } from 'react';
import { db } from "../firebase";
import { addDoc, getDocs, collection, query, orderBy, doc, getDoc } from "firebase/firestore";
import { auth } from "../firebase";
import Quote from './Quote';
import styles from '../styles/Feed.module.css';
import { useRouter } from 'next/router';
import { serverTimestamp } from "firebase/firestore";
import Image from 'next/image';

function Feed() {
  const [quotes, setQuotes] = useState([]);
  const [content, setContent] = useState("");
  const router = useRouter();

  useEffect(() => {
    const getQuotes = async () => {
      const quotesQuery = query(collection(db, 'quotes'), orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(quotesQuery);
      setQuotes(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    };
    getQuotes();
  }, [quotes]);

  const addQuote = async () => {
    if(!auth.currentUser){
      router.push('./');
      return;
    }

    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid));
    const userData = userDoc.data();

    await addDoc(collection(db, "quotes"), {
      author: userData.displayName,
      authorId: auth.currentUser.uid,
      content,
      createdAt: serverTimestamp(),
    });

    setContent("");  // Reset the content state after adding a quote
  };

  return (
    <>
    <div className={styles.feed}>
      <div className={styles.form}>
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Got anything you wanna say?" />
        &nbsp;
        &nbsp;
        <div onClick={addQuote} className={styles.imageButton}>
          <Image src="/quoted.png" width={30} height={30} alt="Quote it!" />
        </div>
      </div>
      <h2>Your Feed</h2>
      {quotes && quotes.map((quote) => <Quote key={quote.id} quote={quote} />)}
    <p> End of Feed 😔 </p>
    </div>
    </>
  );
}

export default Feed;
