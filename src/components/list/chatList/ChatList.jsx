import React, { useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
const ChatList = () => {
  const [addMode, setaddMode] = useState(false);
  return (
    <>
      <div className="chatList">
        <div className="search">
          <div className="searchBar">
            <img src="./search.png" alt="search" />
            <input type="text" placeholder="Search" />
          </div>
          <img
            onClick={() => {
              setaddMode((prev) => !prev);
            }}
            src={addMode ? "./minus.png" : "./plus.png"}
            alt="plus"
            className="add"
          />
        </div>

        <div className="item">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <span>fazal xox</span>
            <p>hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <span>fazal xox</span>
            <p>hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <span>fazal xox</span>
            <p>hello</p>
          </div>
        </div>
        <div className="item">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <span>fazal xox</span>
            <p>hello</p>
          </div>
        </div>

        <div className="item">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <span>fazal xox</span>
            <p>hello</p>
          </div>
        </div>
        {addMode && <AddUser />}
      </div>
    </>
  );
};

export default ChatList;
