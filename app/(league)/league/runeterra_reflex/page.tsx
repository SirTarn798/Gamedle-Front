"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4000"); // Change to your server URL

const canvasWidth = 800;
const canvasHeight = 600;
const playerSize = 50;

interface Player {
  x: number;
  y: number;
}

interface Arrow {
  id: string;
  x: number;
  y: number;
}

export default function RuneterraReflexCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [players, setPlayers] = useState<{ [id: string]: Player }>({});
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [gameStarted, setGameStarted] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleQueueUp = () => {
    socket.emit("findMatch", { username: "x" });
    setLoading(true);

    socket.on("matchFound", ({ roomId }) => {
      console.log("Match found! Room:", roomId);
      setRoomId(roomId);
      setGameStarted(true);
    });
  };

  const handleCancelQueue = () => {
    socket.emit("cancelQueue");
    setLoading(false);
  };

  const handleCreateRoom = () => {
    socket.emit("createRoom");

    socket.on("roomCreated", ({ roomId }) => {
      console.log("Room created! Room ID:", roomId);
      setRoomId(roomId);
      setGameStarted(true);
    });
  };

  const handleJoinRoom = () => {
    if (!joinRoomId) return;
    socket.emit("joinRoom", { roomId: joinRoomId });
    setLoading(true);

    socket.on("roomJoined", ({ roomId }) => {
      console.log("Joined room:", roomId);
      setRoomId(roomId);
      setGameStarted(true);
    });

    socket.on("roomNotFound", () => {
      alert("Room not found! Please check the ID.");
    });
  };

  useEffect(() => {
    if (!gameStarted) return;
  }, [gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);

      // Draw players
      Object.entries(players).forEach(([id, player]) => {
        ctx.fillStyle = id === socket.id ? "blue" : "red"; // Different color for self
        ctx.fillRect(player.x, player.y, playerSize, playerSize);
      });

      // Draw arrows
      arrows.forEach((arrow) => {
        ctx.fillStyle = "black";
        ctx.fillRect(arrow.x, arrow.y, 10, 20); // Arrow size
      });
    };
    draw();
  }, [players, arrows, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const updatePlayers = (updatedPlayers: { [id: string]: Player }) => {
      console.log(updatedPlayers);
      setPlayers(updatedPlayers);
    };

    socket.on("updatePlayers", (updatedPlayers) => {
      updatePlayers(updatedPlayers);
    });

    return () => socket.off("updatePlayers");
  }, [gameStarted]);

  const keys = {
    w: {
      pressed: false,
    },
    a: {
      pressed: false,
    },
    s: {
      pressed: false,
    },
    d: {
      pressed: false,
    },
  };
  setInterval(() => {
    if (keys.w.pressed) socket.emit("move", { key: "w" });
    if (keys.a.pressed) socket.emit("move", { key: "a" });
    if (keys.s.pressed) socket.emit("move", { key: "s" });
    if (keys.d.pressed) socket.emit("move", { key: "d" });
  }, 15);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameStarted) return;
    let key = e.key;
    if (!["w", "a", "s", "d", "f"].includes(key)) return;
    switch (key) {
      case "w":
        keys.w.pressed = true;
        break;
      case "a":
        keys.a.pressed = true;
        break;
      case "s":
        keys.s.pressed = true;
        break;
      case "d":
        keys.d.pressed = true;
        break;
      case "f":
        socket.emit("flash");
    }
  };

  const handleKeyUp = (e: KeyboardEvent) => {
    if (!gameStarted) return;
    let key = e.key;
    if (!["w", "a", "s", "d"].includes(key)) return;
    switch (key) {
      case "w":
        keys.w.pressed = false;
        break;
      case "a":
        keys.a.pressed = false;
        break;
      case "s":
        keys.s.pressed = false;
        break;
      case "d":
        keys.d.pressed = false;
        break;
    }
  };

  useEffect(() => {
    if (!gameStarted) return;
    
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
  
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameStarted]);

  return !gameStarted ? (
    !loading ? (
      <div className="flex flex-col items-center gap-8 mt-12 w-2/6 p-5 pixelBorder-2 bg-mainTheme">
        <h1 className="text-2xl font-bold">Runeterra Reflex</h1>
        <button onClick={handleQueueUp} className="btn-primary">
          Queue Up!
        </button>
        <button onClick={handleCreateRoom} className="btn-primary">
          Create Room
        </button>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Enter Room ID"
            value={joinRoomId}
            onChange={(e) => setJoinRoomId(e.target.value)}
            className="border p-2"
          />
          <button onClick={handleJoinRoom} className="btn-primary">
            Join Room
          </button>
        </div>
      </div>
    ) : (
      <div className="flex flex-col items-center gap-8 mt-12 w-2/6 p-5 pixelBorder-2 bg-mainTheme">
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-3xl">Waiting for other players</h1>
          <div className="animate-spin h-16 w-16 border-4 border-gray-300 border-t-black rounded-full m-10"></div>
          <button
            className="bg-cancelRed py-2 px-5"
            onClick={handleCancelQueue}
          >
            Cancel
          </button>
        </div>
      </div>
    )
  ) : (
    <canvas
      ref={canvasRef}
      width={canvasWidth}
      height={canvasHeight}
      style={{ border: "1px solid black" }}
    />
  );
}
