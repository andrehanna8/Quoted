import { useState, useEffect } from 'react';
import { doc, getDoc, updateDoc, query, collection, where, onSnapshot, getDocs, FieldPath } from 'firebase/firestore';
import { db, auth, storage } from '../firebase';
import { useRouter } from 'next/router';
import { onAuthStateChanged } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import styles from '../styles/UserProfile.module.css';
import Link from 'next/link';
import Quote from '../components/Quote';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const [photoURL, setPhotoURL] = useState('');
  const [birthday, setBirthday] = useState('');
  const [bio, setBio] = useState('');
  const [file, setFile] = useState(null);
  const [quotes, setQuotes] = useState([]);
  const [likedQuotes, setLikedQuotes] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedTab, setSelectedTab] = useState('myQuotes');
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async (authUser) => {
      if (authUser) {
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        const userData = userDoc.data();
        setUser(userData);
        if (userData) {
          setDisplayName(userData.displayName || '');
          setPhotoURL(userData.photoURL || '');
          setBirthday(userData.birthday || '');
          setBio(userData.bio || '');
        }
      }
    };
  
    const unsubscribe = onAuthStateChanged(auth, (authUser) => {
      if (authUser) {
        fetchUser(authUser);
        const q = query(collection(db, 'quotes'), where('authorId', '==', authUser.uid));
        const quotesUnsubscribe = onSnapshot(q, (snapshot) => {
          setQuotes(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
        });
  
        const qLiked = query(collection(db, 'quotes'), where('likedBy', 'array-contains', authUser.uid));
        const likedQuotesUnsubscribe = onSnapshot(qLiked, (snapshot) => {
          setLikedQuotes(snapshot.docs.map((doc) => ({...doc.data(), id: doc.id})));
        });
  
        // Return a cleanup function to unsubscribe from both listeners
        return () => {
          unsubscribe();
          quotesUnsubscribe();
          likedQuotesUnsubscribe();
        }
      } else {
        return unsubscribe;
      }
    });
  }, [photoURL, displayName, birthday, bio, file, likedQuotes]);
  
  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const saveProfile = async () => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      let updatedPhotoURL = photoURL;
      if (file) {
        const storageRef = ref(storage, `users/${currentUser.uid}/${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);
        await new Promise((resolve, reject) => {
          uploadTask.on(
            'state_changed',
            (snapshot) => {},
            (error) => {
              console.error(error);
              reject(error);
            },
            async () => {
              const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
              updatedPhotoURL = downloadURL;
              resolve();
            }
          );
        });
      }

      const userDocRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userDocRef, {
        displayName,
        photoURL: updatedPhotoURL,
        birthday,
        bio,
      });
      setFile(null);
      setIsEditing(false);
    }
  };

  return (
    <div className={styles["user-profile"]}>
      <Link href="/feed">
        <button className={styles["user-profile__button"]}>Back to Feed</button>
      </Link>
      <br />
      {isEditing ? (
        <div className={styles["user-profile__form"]}>
          <p className={styles.profileText}>Upload Profile Pic:</p>
          <input className={styles["user-profile__input"]} type="file" onChange={handleFileChange} />
          {file && <p>{file.name}</p>}
          <p className={styles.profileText}>Display Name:</p>
          <input
            className={styles["user-profile__input"]}
            type="text"
            placeholder="Display Name"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <p className={styles.profileText}>Birthday:</p>
          <input
            className={styles["user-profile__input"]}
            type="date"
            placeholder="Birthday"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
          />
          <p className={styles.profileText}>Bio:</p>
          <textarea
           
            className={styles["user-profile__input"]}
            placeholder="Bio"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
          <button className={styles["user-profile__button"]} onClick={saveProfile}>Save</button>
          <br />
          <button className={styles["user-profile__button"]} onClick={() => setIsEditing(false)}>Cancel</button>
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </div>
      ) : (
        <>
          {photoURL && (
            <div className={styles["user-profile__photo-container"]}>
              <img src={photoURL} alt="Profile" className={styles["user-profile__photo"]} />
            </div>
          )}
          <h1 className={styles.profileText}>{displayName}</h1>
          <p className={styles.profileText}>{bio}</p>
          <button className={styles["user-profile__button"]} onClick={() => setIsEditing(true)}>Edit Profile</button>

          <div className={styles.tabs}>
            <button
              className={selectedTab === 'myQuotes' ? styles.selectedTab : ''}
              onClick={() => setSelectedTab('myQuotes')}
            >
              My Quotes
            </button>
            <button
              className={selectedTab === 'likedQuotes' ? styles.selectedTab : ''}
              onClick={() => setSelectedTab('likedQuotes')}
            >
              Liked Quotes
            </button>
          </div>

          {selectedTab === 'myQuotes' &&
            quotes.map((quote) => (
              <Quote key={quote.id} quote={quote} />
            ))
          }

          {selectedTab === 'likedQuotes' &&
            likedQuotes.map((quote) => (
              <Quote key={quote.id} quote={quote} />
            ))
          }
        </>
      )}
      <br />
      <br />
    </div>
  );
};

export default UserProfile;