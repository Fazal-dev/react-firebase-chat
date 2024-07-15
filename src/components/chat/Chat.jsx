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
import upload from "../../lib/upload";
const Chat = () => {
  const [open, setopen] = useState(false);
  const { chatId, user, isCurrentUserBlocked, isReceiverBlocked } =
    useChatStore();
  const { currentUser } = useUserStore();
  const [chats, setChats] = useState({});
  const [text, settext] = useState("");
  const [img, setImg] = useState({
    file: null,
    url: "",
  });

  const endRef = useRef(null);
  const handleImage = (e) => {
    if (e.target.files[0]) {
      setImg({
        file: e.target.files[0],
        url: URL.createObjectURL(e.target.files[0]),
      });
    }
  };
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
    let imgUrl = null;

    try {
      if (img.file) {
        console.log("Uploading image...");
        imgUrl = await upload(img.file);
        console.log("Image uploaded successfully: ", imgUrl);
      }
      await updateDoc(doc(db, "chats", chatId), {
        messages: arrayUnion({
          senderId: currentUser.id,
          text,
          createdAt: new Date(),
          ...(imgUrl && { img: imgUrl }),
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
    setImg({ file: null, url: "" });
    settext("");
  };

  return (
    <div className="chat">
      <div className="top">
        <div className="user">
          <img src={user?.avatar || "./avatar.png"} alt="avatar" />
          <div className="texts">
            <span> {user?.username}</span>
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
          <div
            className={
              message.senderId === currentUser.id ? "message own" : "message"
            }
            key={message?.createdAt}
          >
            <div className="texts">
              {message.img && <img src={message.img} />}
              <p>{message.text}</p>
              {/* <span>1 min ago</span> */}
            </div>
          </div>
        ))}
        {img.url && (
          <div className="message own ">
            <div className="texts">
              <img src={img.url} />
            </div>
          </div>
        )}

        <div ref={endRef}></div>
      </div>
      <div className="bottom">
        <div className="icons">
          <label htmlFor="file">
            <img src="./img.png" alt="" />
          </label>
          <input
            type="file"
            id="file"
            onChange={handleImage}
            style={{ display: "none" }}
          />
          <img src="./camera.png" alt="" />
          <img src="./mic.png" alt="" />
        </div>
        <input
          type="text"
          placeholder={
            isCurrentUserBlocked || isReceiverBlocked
              ? "You can not send a message"
              : "Type a message..."
          }
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
        <button
          disabled={isCurrentUserBlocked || isReceiverBlocked}
          className="sendButton"
          onClick={handleSend}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
