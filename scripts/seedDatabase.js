// import faker from 'faker';
// import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
// import { db } from '../firebase';

// async function seedDatabase() {
//   try {
//     const users = [];
//     const quotes = [];
  
//     // Create 3 users
//     for(let i = 0; i < 10; i++) {
//       users.push({
//         name: faker.name.findName(),
//         email: faker.internet.email(),
//         profilePic: '/default.png', // set default profile picture
//         createdAt: serverTimestamp(),
//       });
//     }

//     for(let i = 0; i < 10; i++) {
//       const user = users[Math.floor(Math.random() * users.length)];
//       quotes.push({
//         content: faker.lorem.sentences(),
//         author: user.name,
//         profilePic: user.profilePic, // use user's profile picture
//         createdAt: serverTimestamp(),
//       });
//     }

//     // Add users to the Firestore
//     users.forEach(async user => {
//       const docRef = await addDoc(collection(db, 'users'), user);
//       console.log('Document written with ID: ', docRef.id);
//     });

//     // Add quotes to the Firestore
//     quotes.forEach(async quote => {
//       const docRef = await addDoc(collection(db, 'quotes'), quote);
//       console.log('Document written with ID: ', docRef.id);
//     });
    
//   } catch (e) {
//     console.error('Error adding document: ', e);
//   }
// }

// seedDatabase();

import { db, serverTimestamp } from '../firebase';
import { collection, addDoc, getDocs, query } from 'firebase/firestore';
import faker from 'faker';

async function seedDatabase() {
  try {
    // First, retrieve the existing users from the Firestore.
    const usersRef = collection(db, 'users');
    const usersSnapshot = await getDocs(usersRef);
    const users = usersSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

    // Next, generate the quotes using the existing users.
    const quotes = [];
    for(let i = 0; i < 10; i++) {
      const user = users[Math.floor(Math.random() * users.length)];
      quotes.push({
        content: faker.lorem.sentences(),
        author: user.name,
        authorId: user.id,
        profilePic: user.profilePic || '/default.png',
        createdAt: serverTimestamp(),
      });
    }

    // Then, write the generated quotes to Firestore.
    for (const quote of quotes) {
      const docRef = await addDoc(collection(db, 'quotes'), quote);
      console.log('Document written with ID: ', docRef.id);
    }
  } catch (e) {
    console.error('Error adding document: ', e);
  }
}

seedDatabase();
