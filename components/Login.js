import styles from '../styles/Form.module.css';
import { loginWithEmail } from '../lib/auth';
import { useRouter } from 'next/router';

const Login = ({ onSwitch }) => {
  const router = useRouter();

  const handleLogin = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    try {
      await loginWithEmail(email, password);
      router.push('/feed');
    } catch (error) {
      console.error("Error logging in: ", error);
      // handle error
    }
  };

  return (
    <div className={styles.form}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input className={styles.input} type="email" name="email" placeholder="Email" required />
        <input className={styles.input} type="password" name="password" placeholder="Password" required />
        <button className={styles.submit} type="submit">Login</button>
      </form>
      <button onClick={onSwitch}>Don't have an account? Sign up.</button>
    </div>
  );
}

export default Login;
