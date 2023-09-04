import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { MapPinIcon, PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { useEffect, useState } from "react";
import io from "socket.io-client";
import { Button } from "./components/ui/button";

export default function App() {
  const socket = io("https://chatapp-anmu.onrender.com");

  const [message, setMessage] = useState<string>("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);

  const handleSend = () => {
    if (message.trim() !== "") {
      socket.emit("sendMessage", message);
      setMessage(""); // Clear the input field after sending
    }
  };

  const handleLocation = () => {
    if (!navigator.geolocation) {
      return alert("Geolocation not supported");
    }
    navigator.geolocation.getCurrentPosition((position) => {
      socket.emit("sendLocation", {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };
  useEffect(() => {
    socket.on("message", (message) => {
      console.log(message);
      setSentMessages((prevMessages) => [...prevMessages, message]);
    });
  }, []);

  return (
    <div className="w-full min-h-screen bg-slate-500">
      <div className="flex flex-col justify-between min-h-screen container">
        <div className="flex flex-col gap-4 py-5">
          {sentMessages.map((sentMessage, index) => (
            <div className="flex gap-3" key={index}>
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
              <div
                className="bg-gray-200 p-3 rounded-xl rounded-bl-none max-w-fit"
                dangerouslySetInnerHTML={{ __html: sentMessage }}
              ></div>
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
            <Button onClick={handleLocation}>
              <MapPinIcon className="h-6 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
