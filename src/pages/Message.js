import { TrashIcon } from "@heroicons/react/solid";
import moment from "moment";
import { useSelector } from "react-redux/es/hooks/useSelector";
import { useEffect } from "react";

function Message({ id, message, timestamp, name, email, photoURL, file }) {
  const formattedDate = moment(timestamp).format("MMMM DD, YYYY h:mm A");

  const { user } = useSelector((state) => ({
    user: state.user,
  }));

  // Determine whether the message is sent by the current user
  const isCurrentUserMessage = user.email === email;

  // Apply styles for message alignment
  const messageStyle = {
    borderRadius: "8px",
    padding: "10px",
    margin: "10px",
    textAlign: isCurrentUserMessage ? "right" : "left",
  };

  return (
    <div style={messageStyle}>
      <div className="file-document">
        <div className={`message-info flex items-center space-x-2 ${isCurrentUserMessage ? "justify-end" : ""}`}>
          <img src={photoURL} alt={name} className="h-8 w-8 rounded-full" />
          <div>
            <h4 className="text-pink-300 font-semibold text-lg">{name}</h4>
            <p className="text-xs text-gray-400">{formattedDate}</p>
          </div>
        </div>
        <div className="message-content mt-2">
          {file?.name ? (
            <div className="file-message ">
              {file.mimetype && file.mimetype.startsWith("image/") ? (
                <a href={file.path} target="_blank" rel="noopener noreferrer">
                  <img
                    src={file.path}
                    alt="File"
                    className="max-h-64 max-w-full rounded-lg"
                  />
                </a>
              ) : (
                <>
                  {file.mimetype && file.mimetype.startsWith("video/") ? (
                    <a
                      href={file.path}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <video controls className="max-h-64 w-auto rounded-lg">
                        <source src={file.path} type={file.type} />
                        Your browser does not support the video tag.
                      </video>
                    </a>
                  ) : (
                    <a
                      href={file.path}
                      download={file.name}
                      className="text-blue-500 hover:underline"
                    >
                      Download {file.name}
                    </a>
                  )}
                </>
              )}
            </div>
          ) : (
            <p className="text-white">{message}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default Message;