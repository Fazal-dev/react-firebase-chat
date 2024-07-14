import { onAuthStateChanged } from "firebase/auth";
import Chat from "./components/chat/Chat";
import Detail from "./components/detail/Detail";
import List from "./components/list/List";
import Login from "./components/login/Login";
import Notification from "./components/notification/Notification";
import { auth } from "./lib/firebase";
import useUserStore from "./lib/userStore.js";
import { useEffect } from "react";

const App = () => {
  const { currentUser, isLoading, fetchUserInfo } = useUserStore();
  // maintain user state here
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      fetchUserInfo(user?.uid);
    });
    return () => {
      unsub();
    };
  }, [fetchUserInfo]);

  if (isLoading) {
    return <div className="loading">Loading.....</div>;
  }

  return (
    <div className="container">
      {currentUser ? (
        <>
          <List />
          <Chat />
          <Detail />
        </>
      ) : (
        <Login />
      )}

      <Notification />
    </div>
  );
};

export default App;
