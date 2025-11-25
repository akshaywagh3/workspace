import React from "react";

export default function MessageBubble({ message, currentUser }) {

  console.log(currentUser)
  console.log("currentUser")
  const isMine = message.sender === currentUser.id;

  // Format timestamp
  const formattedTime = new Date(message.updatedAt).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });

  // Read status: single tick = sent, double tick = seen
  const isSeen = isMine && message.readBy && message.readBy.length > 1;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"} mb-2`}>
      {!isMine && message.senderAvatar && (
        <img
          src={message.senderAvatar}
          alt={message.senderName}
          className="w-6 h-6 rounded-full mr-2 mt-auto"
        />
      )}

      <div
        className={`max-w-xs p-3 rounded-xl shadow-md break-words 
        ${isMine ? "bg-indigo-600 text-white rounded-br-none" : "bg-gray-800 text-gray-200 rounded-bl-none"}`}
      >
        {!isMine && (
          <p className="text-xs mb-1 text-indigo-300 font-medium truncate max-w-[150px]">
            {message.senderName}
          </p>
        )}

        <p className="leading-snug">{message.content}</p>

        <div className="flex justify-end items-center mt-1 gap-1 text-[10px] opacity-80">
          <span>{formattedTime}</span>
          {isMine && (
            <span className={`ml-1 ${isSeen ? "text-green-400" : "text-gray-400"}`}>
              {isSeen ? "✔✔" : "✔"}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
