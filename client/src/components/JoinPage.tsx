import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import socket from "./socketIo";

import { useStateContext } from "../context/useStateContext";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

export default function JoinPage() {
  // Inline styles example
  const selectedAvatarStyle = {
    border: "4px solid white",
  };

  const avatarOptions = [
    "https://github.com/shadcn.png",
    "https://t3.ftcdn.net/jpg/05/93/79/50/360_F_593795098_PYP7k0mqyiObx9WQOdYTsnRuv8FyTE5v.jpg",
    "https://cdn.pixabay.com/photo/2014/04/10/11/24/rose-320868_640.jpg",
    // Add more avatar URLs here as needed
  ];
  const [selectedAvatar, setSelectedAvatar] = useState<string>(
    avatarOptions[0]
  );
  const handleAvatarSelect = (avatarUrl: string) => {
    setSelectedAvatar(avatarUrl);
  };

  const navigate = useNavigate();
  const { user, setUser } = useStateContext();

  const joinRoom = () => {
    if (user.username !== "" && user.roomID !== "") {
      // Update the user object with the selected avatar URL
      const updatedUser = { ...user, avatar: selectedAvatar };
      setUser(updatedUser);

      socket.emit("join", user.roomID);

      // Navigate to the chat page
      navigate("/chat");
    }
  };

  const handleUserJoin = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  return (
    <div className=" bg-blue-950 w-full min-h-screen flex justify-center items-center text-center">
      <div className="bg-gray-200 w-96 p-3  flex flex-col gap-2 rounded">
        <p className="text-blue-950">Join Page</p>
        <div className="flex gap-2 cursor-pointer">
          {avatarOptions.map((avatarUrl, index) => (
            <Avatar
              key={index}
              onClick={() => handleAvatarSelect(avatarUrl)}
              style={selectedAvatar === avatarUrl ? selectedAvatarStyle : {}}
            >
              <AvatarImage src={avatarUrl} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          ))}
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="flex flex-col gap-3"
        >
          <Input
            placeholder="Username"
            type="text"
            onChange={handleUserJoin}
            name="username"
            id="username"
            required
          />
          <Input
            onChange={handleUserJoin}
            placeholder="Room ID"
            type="text"
            name="roomID"
            id="roomID"
            required
          />

          <Button onClick={joinRoom}>Join</Button>
        </form>
      </div>
    </div>
  );
}
