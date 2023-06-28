import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons';
import Feed from '../components/Feed';
import { useEffect, useState } from 'react';
import { db } from '../firebase';
import { getDocs, collection, doc, getDoc } from 'firebase/firestore';
import Quote from '../components/Quote';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useRouter } from 'next/router';
import styles from '../styles/FeedDrop.module.css';

const FeedPage = () => {
  const [quotes, setQuotes] = useState([]);
  const [user, setUser] = useState(null);
  const [displayName, setDisplayName] = useState('');
  const router = useRouter();
  const auth = getAuth();

  const currentUser = auth.currentUser;

  useEffect(() => {
    const getQuotes = async () => {
      const querySnapshot = await getDocs(collection(db, 'quotes'));
      setQuotes(querySnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    };
    getQuotes();

    const unsubscribe = onAuthStateChanged(auth, async (authUser) => {
      if (authUser) {
        setUser(authUser);
        const userDoc = await getDoc(doc(db, 'users', authUser.uid));
        setDisplayName(userDoc.data().displayName || authUser.email);
      } else {
        setUser(null);
        setDisplayName('');
      }
    });

    return unsubscribe;
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/');
  };

  const goToProfile = () => {
    if (!user) {
      router.push('/');
    } else {
      router.push('/user');
    }
  }

  return (
    <div className={styles.background}>
      <div className={styles.headbar}>
        {user && <h2>Hey, {displayName}</h2>} 
        <div className={styles.headbar_buttons}>
        <button onClick={goToProfile}><FontAwesomeIcon icon={faUser} /></button> &nbsp;
        <button onClick={handleLogout}><FontAwesomeIcon icon={faSignOutAlt} /></button> 
        </div>
      </div>
      <Feed />
    </div>
  );
};

export default FeedPage;
