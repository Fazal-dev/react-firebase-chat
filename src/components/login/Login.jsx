import React, { useState } from "react";
import "./login.css";
import { toast } from "react-toastify";
const Login = () => {
  const [avatar, setavatar] = useState({
    file: null,
    url: "",
  });
  const handleLogin = (e) => {
    e.preventDefault();
    // toast.success("fazal");
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
          <button>Sign In</button>
        </form>
      </div>
      <div className="seperator"></div>
      <div className="item">
        <h2>Create an Account</h2>
        <form>
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
          <input type="text" placeholder="Email" name="email" />
          <input type="text" placeholder="username" name="username" />
          <input type="password" placeholder="Password" name="password" />
          <button>Sign up</button>
        </form>
      </div>
    </div>
  );
};

export default Login;
