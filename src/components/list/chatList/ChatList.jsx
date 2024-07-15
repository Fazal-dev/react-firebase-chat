import React, { useEffect, useState } from "react";
import "./chatList.css";
import AddUser from "./addUser/AddUser";
import useUserStore from "../../../lib/userStore";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../../../lib/firebase";
import { getDoc } from "firebase/firestore";
import useChatStore from "../../../lib/chatStore";

const ChatList = () => {
  const { currentUser } = useUserStore();
  const { changeChat, chatId } = useChatStore();
  const [addMode, setaddMode] = useState(false);
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(
      doc(db, "userchats", currentUser.id),
      async (res) => {
        const items = res.data().chats;
        const promises = items.map(async (item) => {
          const userDocRef = doc(db, "users", item.receiverId);
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

  const handleSelet = async (chat) => {
    const userChats = chats.map((item) => {
      const { user, ...rest } = item;
      return rest;
    });

    const chatIndex = userChats.findIndex(
      (item) => item.chatId === chat.chatId
    );

    userChats[chatIndex].isSeen = true;

    const userChatRef = doc(db, "userchats", currentUser.id);
    try {
      await updateDoc(userChatRef, {
        chats: userChats,
      });
      changeChat(chat?.chatId, chat?.user);
    } catch (error) {
      console.log(error);
    }
  };

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
        {chats.map((chat, index) => (
          <div
            className="item"
            key={index}
            onClick={() => handleSelet(chat)}
            style={{
              backgroundColor: chat?.isSeen ? "transparent" : "#5183fe",
            }}
          >
            <img src={chat.user.avatar || "./avatar.png"} alt="avatar" />
            <div className="texts">
              <span>{chat.user.username}</span>
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
