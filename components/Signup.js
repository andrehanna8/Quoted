import styles from '../styles/Form.module.css';
import { signupWithEmail } from '../lib/auth';
import { useRouter } from 'next/router';

const Signup = ({ onSwitch }) => {
  const router = useRouter();

  const handleSignup = async (event) => {
    event.preventDefault();
    const email = event.target.elements.email.value;
    const password = event.target.elements.password.value;
    try {
      await signupWithEmail(email, password);
      router.push('/feed');
    } catch (error) {
      console.error("Error signing up: ", error);
      // handle error
    }
  };

  return (
    <div className={styles.form}>
      <h2>Sign Up</h2>
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
