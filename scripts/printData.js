import { db } from '../firebase';
import { collection, getDocs } from 'firebase/firestore';

const printData = async (collectionName) => {
  const collectionRef = collection(db, collectionName);
  const snapshot = await getDocs(collectionRef);
  const docs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  console.log(docs);
};

printData('users');
printData('quotes');
