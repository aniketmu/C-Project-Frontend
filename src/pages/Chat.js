import { HashtagIcon, SearchIcon } from "@heroicons/react/outline";
import Picker from "@emoji-mart/react";
import axios from "axios";
import {
  BellIcon,
  ChatIcon,
  UsersIcon,
  InboxIcon,
  QuestionMarkCircleIcon,
  PlusCircleIcon,
  GiftIcon,
  EmojiHappyIcon,
} from "@heroicons/react/solid";
import { useEffect } from "react";
import { v4 as uuid } from "uuid";
import Message from "./Message";
import io from "socket.io-client";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useDispatch } from "react-redux";
import { useState, useRef } from "react";
import { setMessages } from "../store/actions";
import send from "../send.png";
import t_channel from "../t-channel.png";
import t_channel3 from "../t-channel3.png";
import t_channel1 from "../t-channel1.png";
import t_channel4 from "../t-channel4.png";
import t_channel5 from "../t-channel5.png";

function Chat() {
  const [text, setText] = useState({ content: ""});
  const [localMessages, setLocalMessages] = useState([]);
  const [file, setFile] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [channelFile, setChannelFile] = useState("");
  const socket = io("https://c-project-backend.onrender.com");
  const dispatch = useDispatch();
  const messageContainerRef = useRef(null);

  const { user } = useSelector((state) => ({
    user: state.user,
  }));

  const { currentChannelName, currentChannelId } = useSelector((state) => ({
    currentChannelName: state.currChannel.name,
    currentChannelId: state.currChannel.id,
  }));

  const { messages } = useSelector((state) => ({
    messages: state.messages,
  }));

  const handleChange = (e) => {
    setText({
      sender: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      content: e.target.value,
    });
  };

  useEffect(() => {
    socket.emit("join", currentChannelId);

    return () => {
      socket.disconnect();
    };
  }, [currentChannelId]);

  const sendMessage = async (e) => {
    console.log("init");
    e.preventDefault();

    if (!channelFile && (!text.content || text.content.trim() === "")) { // Check if the input is empty or contains only spaces
      return;
    } else {
      if (channelFile) {
        const data = new FormData();
        data.append("name", channelFile.name);
        data.append("file", channelFile);

        try {
          const response = await axios.post(
            `https://c-project-backend.onrender.com/chat-message-file`,
            data
          );
          const newMessage = {
            _id: uuid(),
            content: text.content,
            file: response.data.fileObj,
            timestamp: new Date().toISOString(),
            sender: {
              id: user.id,
            },
          };
  
          socket.emit("chatMessage", {
            channelId: currentChannelId,
            message: newMessage,
          });
  
          setChannelFile("");
          setText({ content: "" }); // Clear the text input
        } catch (error) {
          console.log(error);
        }
      } else {
        const newMessage = {
          _id: uuid(),
          content: text.content,
          file: text.file,
          timestamp: new Date().toISOString(),
          sender: user.id,
        };
  
        socket.emit("chatMessage", {
          channelId: currentChannelId,
          message: newMessage,
        });
        setText({ content: "" }); // Clear the text input
        setChannelFile("");
      }
    }
  };

  socket.on("message", (data) => {
    const modifiedMessage = data.message;

    if (!localMessages.some((message) => message._id === modifiedMessage._id)) {
      dispatch(
        setMessages((prevMessages) => [...prevMessages, modifiedMessage])
      );
      setLocalMessages((prevLocalMessages) => [
        ...prevLocalMessages,
        modifiedMessage,
      ]);
    }

    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }

    setText({});
    setChannelFile("");
  });

  useEffect(() => {
    messageContainerRef.current?.scrollIntoView();
    setText({});
    setFile("");
  }, [localMessages]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (currentChannelId) {
        try {
          const response = await fetch(
            "https://c-project-backend.onrender.com/messages",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ channelId: currentChannelId }),
            }
          );

          if (response.status === 401) {
            console.log("No messages Found");
          } else if (response.status === 200) {
            const data = await response.json();
            const messages = data.messages.messages;
            dispatch(setMessages(messages)); 
            setLocalMessages(messages); 
          }
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchMessages();
  }, [currentChannelId]);

  return currentChannelId ? (
    <div className="flex flex-col h-screen bg-gray-900">
      <header className="flex items-center justify-between space-x-5 border-b border-gray-800 p-4 -mt-1">
        <div className="flex items-center space-x-1">
          <HashtagIcon className="h-6 text-[#72767d]" />
          <h4 className="text-white font-semibold">{currentChannelName}</h4>
        </div>
        <div className="flex space-x-3">
          <BellIcon className="icon" />
          <ChatIcon className="icon" />
          <UsersIcon className="icon" />
          <InboxIcon className="icon" />
          <QuestionMarkCircleIcon className="icon" />
        </div>
      </header>
      <main className="flex-grow overflow-y-scroll scrollbar-hide bg-gray-800 p-4">
        {localMessages.map((message) => (
          <Message
            key={message._id}
            id={message._id}
            message={message.content}
            file={message.file}
            name={message.sender.id.name}
            timestamp={message.timestamp}
            email={message.sender.id.email}
            photoURL={
              message.sender.id.profileImage ||
              `https://cdn.icon-icons.com/icons2/2506/PNG/512/user_icon_150670.png`
            }
          />
        ))}
        <div ref={messageContainerRef}></div>
        <div className="pb-16" />
      </main>
      <div className="flex items-center p-2.5 bg-[#40444b] mx-5 mb-7 rounded-lg">
        <form className="flex-grow flex items-center space-x-2">
          <button
            type="button"
            onClick={() => setShowEmojiPicker(!showEmojiPicker)}
            className="w-7 text-[#dcddde] hover:text-[#FFFFFF] focus:outline-none"
          >
            😄
          </button>

          <input
            type="file"
            id="fileInput"
            onChange={(e) => setChannelFile(e.target.files[0])}
            className="hidden"
          />
          <label
            htmlFor="fileInput"
            className="w-7 text-[#dcddde] hover:text-[#FFFFFF] cursor-pointer"
          >
            📎
          </label>

          {channelFile && (
            <div className="text-[#dcddde] text-sm">
              Selected File: {channelFile.name}
            </div>
          )}

          <input
            type="text"
            placeholder="Type Text"
            className="bg-transparent focus:outline-none text-[#dcddde] w-full placeholder-[#72767d] text-sm"
            value={text.content}
            onChange={(e) => handleChange(e)}
          />

          <button type="submit" onClick={sendMessage}>
            <img
              src={send}
              alt="Send"
              className="h-5 hover:bg-[#2d2f32] cursor-pointer"
            />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 z-10 right-0 lg:right-auto lg:left-0">
              <Picker
                onEmojiSelect={(emoji) => {
                  setText((prevText) => ({
                    ...prevText,
                    content: (prevText.content || "") + emoji.native,
                  }));
                  setShowEmojiPicker(false);
                }}
              />
            </div>
          )}
        </form>
      </div>
    </div>
  ) : (
    <div className="flex flex-col h-screen bg-gray-900">
      <div className="flex-grow overflow-y-scroll scrollbar-hide bg-gray-800 p-4">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-white text-4xl font-semibold mb-6">
            Welcome to Chatter!
          </h1>
          <p className="text-gray-300 text-lg text-center max-w-md mb-8">
            You are now connected to Chatter, where you can chat with your
            friends and colleagues.
          </p>
        </div>
        <div className="flex flex-col items-center">
          <h2 className="text-white text-lg mb-2">
            To create a Channel, please click the plus button next to the
            "Channels" label.
          </h2>
          <img src={t_channel} alt="Channel Icon" className="h-20" />
        </div>
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-white text-lg mb-2">
            Enter the Channel name you wish to add in the box and click Create.
          </h2>
          <img src={t_channel3} alt="Channel Icon" className="h-auto w-72" />
        </div>
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-white text-lg mb-2">
            Click on the Channel name displayed below the Channels label to view
            messages.
          </h2>
          <img src={t_channel5} alt="Channel Icon" className="h-40 w-72" />
        </div>
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-white text-lg mb-2">
            To add members to the Channel, click on the plus button next to the
            Channel name.
          </h2>
          <img src={t_channel1} alt="Channel Icon" className="h-20" />
        </div>
        <div className="flex flex-col items-center mt-4">
          <h2 className="text-white text-lg mb-2">
            Enter the email of the User's email you wish to add to the Channel
            and click the Add button.
          </h2>
          <img src={t_channel4} alt="Channel Icon" className="h-20" />
        </div>
      </div>
    </div>
  );
}

export default Chat;