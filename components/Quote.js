
import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, deleteDoc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import styles from '../styles/Quote.module.css';

const Quote = ({ quote }) => {
  const [editMode, setEditMode] = useState(false);
  const [editedQuote, setEditedQuote] = useState(quote.content);
  const [profilePic, setProfilePic] = useState('/default.png');
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
    const currentUser = auth.currentUser;
    if (currentUser && quote.likedBy) {
      setUserHasLiked(quote.likedBy.includes(currentUser.uid));
    }
  }, [quote ]);

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
        await updateDoc(doc(db, 'quotes', quote.id), {
          likedBy: arrayRemove(currentUser.uid),
        });
      } else {
        await updateDoc(doc(db, 'quotes', quote.id), {
          likedBy: arrayUnion(currentUser.uid),
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
      {/* {console.log(quote)} */}
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
          <span>{quote.likedBy ? quote.likedBy.length : 0}</span>
          
          <button onClick={toggleLike} className={userHasLiked ? styles.likeButtonActive : styles.likeButton}>
            <img src="/heart.png" alt="Heart" width="15px" height="15px"  />
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
