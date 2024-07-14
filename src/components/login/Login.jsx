import React, { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
import { auth, db } from "../../lib/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import upload from "../../lib/upload.js";
const Login = () => {
  const [avatar, setavatar] = useState({
    file: null,
    url: "",
  });
  const [loading, setloading] = useState(false);
  const handleRegister = async (e) => {
    e.preventDefault();
    setloading(true);
    const formData = new FormData(e.target);
    const { username, email, password } = Object.fromEntries(formData);
    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const imgUrl = await upload(avatar.file);

      //add new user to db
      await setDoc(doc(db, "users", res.user.uid), {
        username,
        email,
        avatar: imgUrl,
        id: res.user.uid,
        blocked: [],
      });
      // add  new userchat collection
      await setDoc(doc(db, "userchats", res.user.uid), {
        chats: [],
      });
      toast.success(`Account created you can login now`);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setloading(false);
    }
  };
  const handleLogin = async (e) => {
    e.preventDefault();
    setloading(true);
    try {
      const formData = new FormData(e.target);
      const { email, password } = Object.fromEntries(formData);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setloading(false);
    }
  };
  const handleAvatar = (e) => {
    if (e.target.files[0]) {
      setavatar({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };

  return (
    <div className="login">
      <div className="item">
        <h2>Welcome back,</h2>
        <form onSubmit={handleLogin}>
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>
            {" "}
            {loading ? "Loading.." : "Sign In"}
          </button>
        </form>
      </div>
      <div className="seperator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form onSubmit={handleRegister}>
          <label htmlFor="file">
            <img src={avatar.url || "./avatar.png"} alt="" />
            Upload an Image
          </label>
          <input
            type="file"
            onChange={handleAvatar}
            style={{ display: "none" }}
            id="file"
          />
          <input type="text" placeholder="username" name="username" />
          <input type="text" placeholder="Email" name="email" />
          <input type="password" placeholder="Password" name="password" />
          <button disabled={loading}>
            {loading ? "Loading.." : "Sign up"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
