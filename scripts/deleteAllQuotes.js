// Import the required libraries and modules
import { getDocs, collection, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase'; // update the path as needed

const deleteAllQuotes = async () => {
  // Get a reference to the quotes collection
  const quotesCollectionRef = collection(db, 'quotes');

  // Get all quotes
  const querySnapshot = await getDocs(quotesCollectionRef);

  // Delete each quote
  querySnapshot.forEach((docSnapshot) => {
    deleteDoc(doc(db, 'quotes', docSnapshot.id));
  });
};

// Call the function
deleteAllQuotes();
