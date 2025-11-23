import React from "react";

export default function MessageBubble({ message, currentUser }) {
  const isMine = message.sender === currentUser.id;

  return (
    <div className={`flex ${isMine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-xs p-3 rounded-xl shadow-md ${
          isMine
            ? "bg-indigo-600 text-white rounded-br-none"
            : "bg-gray-800 text-gray-200 rounded-bl-none"
        }`}
      >
        {!isMine && (
          <p className="text-xs mb-1 text-indigo-300 font-medium">
            {message.senderName}
          </p>
        )}

        <p className="leading-snug">{message.messageText}</p>

        <div className="flex justify-between items-center mt-1">
          <p className="text-[10px] opacity-80">{message.time}</p>

          {isMine && message.readBy && message.readBy.length > 1 && (
            <p className="text-[10px] ml-2 opacity-75">✔✔</p> // double tick = seen
          )}
        </div>
      </div>
    </div>
  );
}
