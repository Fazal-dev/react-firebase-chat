import React from "react";
import "./userInfo.css";
const UserInfo = () => {
  return (
    <div className="userInfo">
      <div className="user">
        <img src="./avatar.png" alt="avtar" />
        <h3>fazal shain</h3>
      </div>
      <div className="icons">
        <img src="./more.png" alt="more" />
        <img src="./video.png" alt="videa" />
        <img src="./edit.png" alt="edit" />
      </div>
    </div>
  );
};

export default UserInfo;
