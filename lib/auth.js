import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";
import { auth, db } from '../firebase'; // updated import statement

export const loginWithEmail = (email, password) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const signupWithEmail = async (email, password) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  // After creating the user, save their information in Firestore
  await setDoc(doc(db, 'users', user.uid), {
    displayName: user.displayName || '',
    email: user.email,
    photoURL: user.photoURL || '',
  });

  return userCredential;
};

export const logout = () => {
  return signOut(auth);
};
