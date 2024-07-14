import React, { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import useUserStore from "../../../lib/userStore";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { getDoc } from "firebase/firestore";

const ChatList = () => {
  const { currentUser } = useUserStore();
  const [addMode, setaddMode] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receverId);
          const userDocSnap = await getDoc(userDocRef);
          const user = userDocSnap.data();
          return { ...item, user };
        });
        const chatData = await Promise.all(promises);

        setChats(chatData.sort((a, b) => b.updatedAt - a.updatedAt));
      }
    );

    return () => {
      unsub();
    };
  }, [currentUser.id]);
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
        {chats.map((chat) => (
          <div className="item" key={chat.chatId}>
            <img src="./avatar.png" alt="avatar" />
            <div className="texts">
              <span>fazal xox</span>
              <p>{chat.lastMessage}</p>
            </div>
          </div>
        ))}

        {addMode && <AddUser />}
      </div>
    </>
  );
};

export default ChatList;
