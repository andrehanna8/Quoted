import styles from '../styles/Modal.module.css';

const Modal = ({ children, onClose }) => {
  return (
    <div className={styles.modal}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>X</button>
        {children}
      </div>
    </div>
  );
}

export default Modal;
