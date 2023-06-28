// components/Form.js

import React from 'react';
import styles from '../styles/Form.module.css';

const Form = ({ handleSwitch, heading, buttonText, switchText, switchButtonText }) => {
  return (
    <div className={styles.formContainer}>
      <h2 className={styles.heading}>{heading}</h2>
      <form className={styles.form}>
        <input className={styles.input} type="email" placeholder="Email" />
        <input className={styles.input} type="password" placeholder="Password" />
        <button className={styles.submit} type="submit">{buttonText}</button>
      </form>
      <p className={styles.switchText}>
        {switchText}
        <button className={styles.switchButton} onClick={handleSwitch}>{switchButtonText}</button>
      </p>
    </div>
  );
};

export default Form;
