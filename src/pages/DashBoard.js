import React from "react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  ServerIcon,
  PlusIcon,
  CogIcon,
  ChevronDownIcon,
  MicrophoneIcon,
  PhoneIcon,
} from "@heroicons/react/solid";
import { setChannels, setDirect, setCurrChannel } from "../store/actions";
import {
  changeUserEmail,
  changeUserName,
  changeUserId,
  changeUserImage,
} from "../store/actions";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import Channel from "./Channel";
import Chat from "./Chat";
import chat from "../chat.png";

const DashBoard = () => {
  const [email, setEmail] = useState("");
  const [matchingEmails, setMatchingEmails] = useState([]);
  const [debounceTimeout, setDebounceTimeout] = useState(null);
  const [loading, setLoading] = useState(false);
  const [newChannelName, setNewChannelName] = useState(""); 
  const [isAddingChannel, setIsAddingChannel] = useState(false); 
  const [channelAdd, setChannelAdd] = useState(0);

  const { user } = useSelector((state) => ({
    user: state.user,
  }));

  const dispatch = useDispatch();

  const { channels } = useSelector((state) => ({
    channels: state.channels,
  }));

  const { directs } = useSelector((state) => ({
    directs: state.directs,
  }));

  const handleMatchingEmailClick = (clickedEmail, e) => {
    e.preventDefault();
    setEmail(clickedEmail);
    setMatchingEmails([]);
  };

  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const newDebounceTimeout = setTimeout(async () => {
      try {
        const response = await fetch(
          "https://c-project-backend.onrender.com/search-Users",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userEmail: email }),
          }
        );
        if (response.status === 404) {
          console.log("user not found");
        } else if (response.status === 200) {
          const data = await response.json();
          setMatchingEmails(data.users);
        }
      } catch (error) {
        console.log(error);
      }
    }, 300);
    setDebounceTimeout(newDebounceTimeout);
  };

  const navigate = useNavigate();

  const handleAddChannel = async () => {
    if (newChannelName.trim() === "") {
      // Handle empty channel name
      console.log("Channel name cannot be empty");
      return;
    }
    try {
      const response = await fetch(
        "https://c-project-backend.onrender.com/add-channel",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ name: newChannelName, userId: user.id }),
        }
      );

      if (response.status === 500) {
        console.log("Channel could not be created");
      } else if (response.status === 200) {
        const data = await response.json();
        console.log("Channel added successfully");
        setChannelAdd(channelAdd + 1);
      }
    } catch (error) {
      console.log(error);
    }

    setIsAddingChannel(false);
    setNewChannelName(""); 
  };

  useEffect(() => {
    const token = Cookies.get("userId");
    if (!token) {
      navigate("/signin");
    }
  });

  useEffect(() => {
    const storedUserId = Cookies.get("userId");
    const storedUserEmail = Cookies.get("userEmail");
    const storedUserName = Cookies.get("userName");
    const storedprofileImage = Cookies.get("profileImage");

    dispatch(changeUserId(storedUserId));
    dispatch(changeUserEmail(storedUserEmail));
    dispatch(changeUserName(storedUserName));
    dispatch(changeUserImage(storedprofileImage));
  }, []);

  useEffect(() => {
    if (user.id) {
      (async () => {
        setLoading(true);
        const response = await fetch(
          "https://c-project-backend.onrender.com/channel",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userId: user.id }),
          }
        );

        if (response.status === 404) {
          setLoading(false);
          return;
        } else if (response.status === 200) {
          const data = await response.json();
          dispatch(setChannels(data.channel));
          setLoading(false);
        }
      })();
    }
  }, [user.id, channelAdd]);

  const handleSignOut = () => {
    Cookies.remove("token");
    Cookies.remove("userEmail");
    Cookies.remove("userName");
    Cookies.remove("userId");

    navigate("/signin");
  };

  return (
    <>
      <div className="flex h-screen">
        <div className="flex flex-col space-y-3 bg-[#A4508B] p-3 min-w-max">
          <div className="server-default hover:bg-discord_purple">
            <Link to="/dashboard">
              <img src={chat} alt="" className="h-5" />
            </Link>
          </div>
          <hr className=" border-gray-700 border w-8 mx-auto" />
          <div className="server-default hover:bg[#A5A4CB] group"></div>
        </div>

        <div className="bg-[#002244] flex flex-col w-1/4 sm:w-auto lg:w-auto">
          <h2 className="flex text-white font-bold text-sm items-center justify-between border-b border-gray-800 p-4 hover:bg-[#34373C] cursor-pointer">
            Welcome {user.name?.split(" ")[0]}
          </h2>
          <a
            href="#_"
            className="relative p-0.5 inline-flex items-center justify-center font-bold overflow-hidden group rounded-md"
          >
            <span className="w-full h-full bg-gradient-to-br from-[#ff8a05] via-[#ff5478] to-[#ff00c6] group-hover:from-[#ff00c6] group-hover:via-[#ff5478] group-hover:to-[#ff8a05] absolute"></span>
            <span className="relative px-6 py-3 transition-all ease-out rounded-md group-hover:bg-opacity-0 duration-400">
              <span
                className="relative text-white"
                onClick={() => {navigate("/profile"); dispatch(
                  setCurrChannel({})
                )} }
              >
                Profile
              </span>
            </span>
          </a>
          <div className="text-[#8e9297] flex-grow overflow-y-scroll scrollbar-hide">
            <div className="flex items-center p-2 mb-2">
              <ChevronDownIcon className="h-3  mr-2" />
              <h4 className="font-semibold ">Channels</h4>
              <PlusIcon
                className="h-6 ml-auto cursor-pointer hover:text-white"
                onClick={(e) => setIsAddingChannel(true)}
              />
            </div>
            <div className="flex flex-col space-y-2 px-2 mb-4">
              {channels?.map((channel) => (
                <Channel
                  key={channel._id}
                  id={channel._id}
                  channelName={channel.name}
                />
              ))}
            </div>
            <div className="flex flex-col space-y-2 px-2 mb-4"></div>
          </div>
          <div className="bg-[#292b2f] p-2 flex justify-between items-center space-x-8">
            <div className="flex items-center space-x-1">
              <h4 className="text-white text-xs font-medium"></h4>
            </div>
            <div className="text-gray-400 flex items-center">
              <div
                className="hover:bg-[#3A3C43] p-2 rounded-md cursor-pointer"
                onClick={handleSignOut}
              >
                <a
                  href="#_"
                  className="relative w-1/6 sm:w-auto lg:w-auto inline-flex items-center justify-center px-6 py-3 overflow-hidden font-bold text-white rounded-md shadow-2xl group"
                >
                  <span className="absolute inset-0 w-full h-full transition duration-300 ease-out opacity-0 bg-gradient-to-br from-pink-600 via-purple-700 to-blue-400 group-hover:opacity-100"></span>

                  <span className="absolute top-0 left-0 w-full bg-gradient-to-b from-white to-transparent opacity-5 h-1/3"></span>

                  <span className="absolute bottom-0 left-0 w-full h-1/3 bg-gradient-to-t from-white to-transparent opacity-5"></span>

                  <span className="absolute bottom-0 left-0 w-4 h-full bg-gradient-to-r from-white to-transparent opacity-5"></span>

                  <span className="absolute bottom-0 right-0 w-4 h-full bg-gradient-to-l from-white to-transparent opacity-5"></span>
                  <span className="absolute inset-0 w-full h-full border border-white rounded-md opacity-10"></span>
                  <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-56 group-hover:h-56 opacity-5"></span>
                  <span className="relative" onClick={handleSignOut}>
                    Sign Out
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#B0B0B0] flex-grow">
          <Chat />
        </div>
      </div>

      {isAddingChannel && (
        <div className="fixed top-0 left-0 flex items-center justify-center w-screen h-screen bg-gray-800 bg-opacity-60 z-50">
          <div className="bg-white p-4 rounded-lg shadow-lg">
            <h3 className="text-lg font-semibold mb-2">Enter Channel Name</h3>
            <input
              type="text"
              className="border p-2 w-full"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
            />
            <div className="flex justify-end mt-2">
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={handleAddChannel}
              >
                Create
              </button>
              <button
                className="px-4 py-2 ml-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={() => setIsAddingChannel(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DashBoard;
