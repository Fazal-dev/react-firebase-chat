import React, { useEffect, useRef, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import "./chat.css";
import {
  arrayUnion,
  doc,
  getDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../lib/firebase";
import useChatStore from "../../lib/chatStore";
import useUserStore from "../../lib/userStore";
const Chat = () => {
  const [open, setopen] = useState(false);
  const { chatId, user } = useChatStore();
  const { currentUser } = useUserStore();
  const [chats, setChats] = useState({});
  const [text, settext] = useState("");
  const endRef = useRef(null);
  const handleEmoji = (event) => {
    settext((prev) => prev + event.emoji);
    setopen(false);
  };

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [text]);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", chatId), (res) => {
      setChats(res.data());
    });
    console.log(chats);
    return () => {
      unSub();
    };
  }, [chatId]);
  const handleSend = async () => {
    if (text === "") return;

    try {
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
        }),
      });
      const userIds = [currentUser.id, user.id];
      userIds.forEach(async (id) => {
        const userChatsRef = doc(db, "userchats", id);
        const userChatSnapshot = await getDoc(userChatsRef);
        if (userChatSnapshot.exists()) {
          const userChatsData = userChatSnapshot.data();
          const chatIndex = userChatsData.chats.findIndex(
            (c) => c.chatId === chatId
          );

          userChatsData.chats[chatIndex].lastMessage = text;
          userChatsData.chats[chatIndex].isSeen =
            id === currentUser.id ? true : false;
          userChatsData.chats[chatIndex].updatedAt = Date.now();
          await updateDoc(userChatsRef, {
            chats: userChatsData.chats,
          });
        }
      });
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src="./avatar.png" alt="avatar" />
          <div className="texts">
            <span> fazal davind</span>
            <p>Lorem ipsum dolor sit amet</p>
          </div>
        </div>
        <div className="icons">
          <img src="./phone.png" alt="" />
          <img src="./video.png" alt="" />
          <img src="./info.png" alt="" />
        </div>
      </div>
      <div className="center">
        {chats?.messages?.map((message) => (
          <div className="message own" key={message?.createdAt}>
            <div className="texts">
              {message.img && <img src={message.img} />}
              <p>{message.text}</p>
              {/* <span>1 min ago</span> */}
            </div>
          </div>
        ))}

        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <img src="./img.png" alt="" />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => {
            settext(e.target.value);
          }}
        />
        <div className="emoji">
          <img
            src="./emoji.png"
            alt=""
            onClick={() => {
              setopen((prev) => !prev);
            }}
          />
          {open && (
            <div className="picker">
              <EmojiPicker onEmojiClick={handleEmoji} />
            </div>
          )}
        </div>
        <button className="sendButton" onClick={handleSend}>
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
