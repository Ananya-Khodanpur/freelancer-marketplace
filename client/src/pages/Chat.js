import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import axios from "axios";

const Chat = ({ currentUser }) => {
  const [messages, setMessages] = useState([]);
  const [receiverId, setReceiverId] = useState(""); // Replace with actual userId later
  const [content, setContent] = useState("");

  const socket = useRef();

  useEffect(() => {
    // Connect to socket server
    socket.current = io("http://localhost:5000", {
      withCredentials: true,
    });

    // Register user on socket server
    if (currentUser?._id) {
      socket.current.emit("addUser", currentUser._id);
    }

    // Listen for incoming messages
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

    return () => {
      socket.current.disconnect();
    };
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

    try {
      const newMessage = {
        sender: currentUser._id,
        receiver: receiverId,
        content,
      };

      await axios.post("http://localhost:5000/api/messages", newMessage);

      // Emit real-time message
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
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">💬 Chat</h2>

      <div className="mb-2">
        <input
          type="text"
          placeholder="Receiver ID"
          value={receiverId}
          onChange={(e) => setReceiverId(e.target.value)}
          className="border p-2 w-full mb-2"
        />
        <textarea
          placeholder="Type your message..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="border p-2 w-full"
        />
        <button onClick={handleSend} className="mt-2 px-4 py-2 bg-blue-500 text-white rounded">
          Send
        </button>
      </div>

      <ul className="mt-4 space-y-2">
        {messages.map((msg, index) => (
          <li key={index} className="bg-gray-100 p-2 rounded">
            <strong>{msg.sender === currentUser._id ? "You" : "Other"}:</strong> {msg.content}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Chat;
