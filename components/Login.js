import styles from '../styles/Form.module.css';
import { loginWithEmail } from '../lib/auth';
import { useRouter } from 'next/router';
import { useState } from 'react';

const Login = ({ onSwitch }) => {
  const router = useRouter();
  const [error, setError] = useState(null); 

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    try {
      await loginWithEmail(email, password);
      router.push('/feed');
    } catch (error) {
      console.error("Error logging in: ", error);
      setError(error.message); 
    }
  };

  return (
    <div className={styles.form}>
      <h2>Login</h2>
      {error && (
        <div className={styles.errorBanner}>
          {error}
        </div>
      )}
      <form onSubmit={handleLogin}>
        <input className={styles.input} type="email" name="email" placeholder="Email" required />
        <br />
        <br />
        <input className={styles.input} type="password" name="password" placeholder="Password" required />
        <br />
        <br />
        <button className={styles.submit} type="submit">Login</button>
      </form>
      <button onClick={onSwitch}>Don't have an account? Sign up.</button>
    </div>
  );
}

export default Login;
