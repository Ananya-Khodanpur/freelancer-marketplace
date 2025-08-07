import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState("");
  const [content, setContent] = useState("");

  const socket = useRef();

  useEffect(() => {
    socket.current = io("http://localhost:5000", {
      withCredentials: true,
    });

    if (currentUser?._id) {
      socket.current.emit("addUser", currentUser._id);
    }

    socket.current.on("getMessage", (data) => {
      setMessages((prev) => [
        ...prev,
        {
          sender: data.senderId,
          receiver: currentUser._id,
          content: data.content,
          timestamp: new Date(),
        },
      ]);
    });

    return () => socket.current.disconnect();
  }, [currentUser]);

  useEffect(() => {
    if (currentUser?._id) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/api/messages/${currentUser._id}`);
          setMessages(res.data);
        } catch (err) {
          console.error("Error fetching messages", err);
        }
      };
      fetchMessages();
    }
  }, [currentUser]);

  const handleSend = async () => {
    if (!receiverId || !content) return;

    const newMessage = {
      sender: currentUser._id,
      receiver: receiverId,
      content,
    };

    try {
      await axios.post("http://localhost:5000/api/messages", newMessage);
      socket.current.emit("sendMessage", {
        senderId: currentUser._id,
        receiverId,
        content,
      });

      setMessages((prev) => [...prev, { ...newMessage, timestamp: new Date() }]);
      setContent("");
    } catch (err) {
      console.error("Error sending message", err);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto bg-white shadow-lg rounded-lg min-h-screen">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">💬 Live Chat</h2>

      <div className="mb-4 flex gap-2">
        <input
          type="text"
          placeholder="Receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleSend}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Send
        </button>
      </div>

      <div className="flex flex-col gap-2 mb-4">
        <textarea
          rows={2}
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 resize-none focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
      </div>

      <div className="h-[400px] overflow-y-auto space-y-3 px-2 bg-gray-50 p-4 rounded-lg shadow-inner">
        {messages.map((msg, index) => {
          const isOwn = msg.sender === currentUser._id;
          return (
            <div
              key={index}
              className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg text-sm shadow-md ${
                  isOwn
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-200 text-gray-800 rounded-bl-none"
                }`}
              >
                <p>{msg.content}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Chat;
