import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { useStateContext } from "@/context/useStateContext";
import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import socket from "./socketIo";
import { Button } from "./ui/button";

type TMessageData = {
  room: string;
  author: string;
  message: string;
  time: string;
  authorAvatar: string;
};

export default function App() {
  const { user } = useStateContext();
  // socket.emit("join", user.roomID);
  const [message, setMessage] = useState<string>("");
  const [sentMessages, setSentMessages] = useState<TMessageData[]>([]);

  const handleSend = () => {
    if (message.trim() !== "") {
      const messageData = {
        room: user.roomID,
        author: user.username,
        message: message,
        authorAvatar: user.avatar, // Include the sender's avatar
      };
      socket.emit("sendMessage", messageData);
      setMessage("");
    }
  };

  useEffect(() => {
    socket.on("message", (message) => {
      console.log(message);
      setSentMessages((prevMessages) => [
        ...prevMessages,
        {
          ...message,
          authorAvatar:
            message.author === user.username
              ? user.avatar
              : message.authorAvatar,
        },
      ]);
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-500">
      <div className="flex flex-col justify-between min-h-screen container">
        <div className="flex flex-col gap-4 py-5">
          {sentMessages.map((sentMessage, index) => (
            <div
              className={`flex gap-3 ${
                sentMessage.author === user.username
                  ? "flex-row-reverse"
                  : "justify-start"
              }`}
              key={index}
            >
              <Avatar>
                <AvatarImage
                  src={
                    sentMessage.author === user.username
                      ? user.avatar
                      : sentMessage.authorAvatar
                  }
                />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div
                className={`p-3 max-w-fit ${
                  sentMessage.author === user.username
                    ? "bg-gray-200 text-gray-800 rounded rounded-br-none"
                    : "bg-blue-500 text-white rounded rounded-bl-none"
                }`}
              >
                {sentMessage.message}
              </div>
            </div>
          ))}
        </div>
        <form onClick={(e) => e.preventDefault()}>
          <div className="flex py-5 gap-3">
            <Input
              onChange={(e) => setMessage(e.target.value)}
              value={message}
              placeholder="Write your message 💬"
              type="text"
              name="message"
              id="message"
            />
            <Button onClick={handleSend}>
              <PaperAirplaneIcon className="w-5 h-5" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
