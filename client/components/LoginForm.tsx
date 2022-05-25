import React, { useState } from "react";
import { useAppDispatch } from "../app/hooks";
import { login, register } from "../app/store/auth/auth.actionCreator";
import { IPayload } from "../types/payload";

const LoginForm = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const dispatch = useAppDispatch();
  return (
    <div>
      <input
        type="text"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="email"
      />
      <input
        type="password"
        name={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="password"
      />
      <button
        onClick={() => {
          dispatch(
            login({
              email,
              password,
            })
          );
        }}
      >
        Логин
      </button>
      <button
        onClick={() =>
          dispatch(
            register({
              email,
              password,
            })
          )
        }
      >
        Регистрация
      </button>
    </div>
  );
};

export default LoginForm;
