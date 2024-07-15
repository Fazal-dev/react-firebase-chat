import React, { useState } from "react";
import "./addUser.css";
import { db } from "../../../../lib/firebase.js";
import {
  arrayUnion,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import useUserStore from "../../../../lib/userStore.js";

const AddUser = () => {
  const [user, setUser] = useState(null);
  const { currentUser } = useUserStore();
  const handleSearch = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const userName = formData.get("username");
    try {
      const userRef = collection(db, "users");
      const q = query(userRef, where("username", "==", userName));
      const quarySnapshot = await getDocs(q);
      if (!quarySnapshot.empty) {
        setUser(quarySnapshot.docs[0].data());
      }
    } catch (error) {
      console.log(error);
    }
  };
  const handleAdd = async (e) => {
    e.preventDefault();
    const chatRef = collection(db, "chats");
    const userChatRef = collection(db, "userchats");
    try {
      const newChatsRef = doc(chatRef);
      await setDoc(newChatsRef, {
        createdAt: serverTimestamp(),
        messages: [],
      });

      await updateDoc(doc(userChatRef, user.id), {
        chats: arrayUnion({
          chatId: newChatsRef.id,
          lastMessage: "",
          receiverId: currentUser.id,
          updatedAt: Date.now(),
        }),
      });
      await updateDoc(doc(userChatRef, currentUser.id), {
        chats: arrayUnion({
          chatId: newChatsRef.id,
          lastMessage: "",
          receiverId: user.id,
          updatedAt: Date.now(),
        }),
      });
    } catch (error) {}
  };
  return (
    <div className="addUser">
      <form onSubmit={handleSearch}>
        <input type="text" name="username" placeholder="Username" />
        <button>Search</button>
      </form>
      {user && (
        <div className="user">
          <div className="detail">
            <img src={user.avatar || "./avatar.png"} />
            <span>{user.username}</span>
          </div>
          <button onClick={handleAdd}>Add User</button>
        </div>
      )}
    </div>
  );
};

export default AddUser;
