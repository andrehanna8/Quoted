import styles from '../styles/Form.module.css';
import { signupWithEmail } from '../lib/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Signup = ({ onSwitch }) => {
  const router = useRouter();
  const [error, setError] = useState(null); // Add state for error

  const handleSignup = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    try {
      await signupWithEmail(email, password);
      router.push('/feed');
    } catch (error) {
      console.error("Error signing up: ", error);
      setError(error.message); // Set error state
    }
  };

  return (
    <div className={styles.form}>
      <h2>Sign Up</h2>
      {/* Add error banner */}
      {error && (
        <div className={styles.errorBanner}>
          {error}
        </div>
      )}
      <form onSubmit={handleSignup}>
        <input className={styles.input} type="email" name="email" placeholder="Email" required />
        <br />
        <br />
        <input className={styles.input} type="password" name="password" placeholder="Password" required />
        <br />
        <br />
        <button className={styles.submit} type="submit">Sign Up</button>
      </form>
      <button onClick={onSwitch}>Already have an account? Login.</button>
    </div>
  );
}

export default Signup;
