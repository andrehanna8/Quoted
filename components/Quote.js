import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, deleteDoc, setDoc, getDoc, collection, onSnapshot, query } from 'firebase/firestore';
import styles from '../styles/Quote.module.css'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';

const Quote = ({ quote }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedQuote, setEditedQuote] = useState(quote.content);
  const [profilePic, setProfilePic] = useState('/default.png');
  const [likes, setLikes] = useState([]);
  const [userHasLiked, setUserHasLiked] = useState(false);

  useEffect(() => {
    const fetchProfilePic = async () => {
      const userDoc = await getDoc(doc(db, 'users', quote.authorId));
      const userData = userDoc.data();
      setProfilePic(userData.photoURL || '/default.png');
    };
    fetchProfilePic();
  }, [quote.authorId]);

  useEffect(() => {
    const fetchLikes = () => {
      const q = query(collection(db, 'quotes', quote.id, 'likes'));
      const unsubscribe = onSnapshot(q, (snapshot) => {
        setLikes(snapshot.docs.map((doc) => doc.data()));
        const currentUser = auth.currentUser;
        if (currentUser) {
          setUserHasLiked(snapshot.docs.some((doc) => doc.id === currentUser.uid));
        }
      });
      return unsubscribe;
    };
    return fetchLikes();
  }, [quote.id]);

  const deleteQuote = async () => {
    await deleteDoc(doc(db, 'quotes', quote.id));
  };

  const handleEdit = () => {
    setEditMode(true);
  };

  const handleQuoteChange = (event) => {
    setEditedQuote(event.target.value);
  };

  const saveEditedQuote = async () => {
    await setDoc(doc(db, 'quotes', quote.id), { ...quote, content: editedQuote });
    setEditMode(false);
  };

  const toggleLike = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      if (userHasLiked) {
        await deleteDoc(doc(db, 'quotes', quote.id, 'likes', currentUser.uid));
      } else {
        await setDoc(doc(db, 'quotes', quote.id, 'likes', currentUser.uid), {
          userId: currentUser.uid,
        });
      }
    }
  };

  const currentUser = auth.currentUser;
  const date = quote.createdAt 
    ? new Date(quote.createdAt.seconds * 1000).toLocaleString() 
    : 'Just now';

  return (
    <div className={styles.quoteContainer}>
      <img src={profilePic} alt={quote.author} className={styles.profilePic}/>
      <div className={styles.textContainer}>
        <h2 className={styles.author}>{quote.author}</h2>

        {editMode ? (
          <>
            <textarea value={editedQuote} onChange={handleQuoteChange} />
            <button onClick={saveEditedQuote} className={styles.saveButton}>Save</button>
          </>
        ) : (
          <>
          <br />
            <p className={styles.content}>{quote.content}</p>
            <br />
            
          </>
        )}

    <div className={styles.likeContainer}>
          <br />
          <span>{likes.length}</span>
          
          <button onClick={toggleLike} className={userHasLiked ? styles.likeButtonActive : styles.likeButton}>
            <FontAwesomeIcon icon={faHeart} />
          </button>
        </div>

        {currentUser && currentUser.uid === quote.authorId && !editMode &&
          <>
          <br />
            <button onClick={deleteQuote} className={styles.deleteButton}>Delete</button>
            <button onClick={handleEdit} className={styles.editButton}>Edit</button>
          </>
        }
        <p className={styles.date}>{date}</p>
      </div>
    </div>
  );
};

export default Quote;
