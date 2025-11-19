import React from "react";

export default function MessageBubble({ message }) {
  const { sender, text, time, isMine } = message;

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
          <p className="text-xs mb-1 text-indigo-300 font-medium">{sender}</p>
        )}
        <p className="leading-snug">{text}</p>
        <p className="text-[10px] mt-1 opacity-80 text-right">{time}</p>
      </div>
    </div>
  );
}
