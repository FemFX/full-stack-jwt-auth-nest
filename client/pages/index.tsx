import type { NextPage } from "next";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { checkAuth, logout } from "../app/store/auth/auth.actionCreator";
import LoginForm from "../components/LoginForm";
import styles from "../styles/Home.module.css";

const Home: NextPage = () => {
  const { isAuth, user } = useAppSelector((state) => state.authReducer);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(checkAuth());
    }
  }, []);

  return (
    <div className={styles.container}>
      <h1>{isAuth ? user.email : "Пользователь не авторизован"}</h1>
      <LoginForm />
      <button onClick={() => dispatch(logout())}>logout</button>
    </div>
  );
};

export default Home;
