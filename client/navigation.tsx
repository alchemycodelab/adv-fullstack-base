import { NavLink } from 'react-router-dom';
import styles from './navigation.module.css';

export default function Navigation() {
  return (
    <nav className={styles.navigation}>
      <NavLink to="">Home</NavLink>
      <NavLink to="foos">foos</NavLink>
      <NavLink to="cats">cats</NavLink>
    </nav>
  );
}
