"use client";

import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

import up1 from "@/public/playerMovement/up1.png";
import up2 from "@/public/playerMovement/up2.png";
import down1 from "@/public/playerMovement/down1.png";
import down2 from "@/public/playerMovement/down2.png";
import left1 from "@/public/playerMovement/left1.png";
import left2 from "@/public/playerMovement/left2.png";
import right1 from "@/public/playerMovement/right1.png";
import right2 from "@/public/playerMovement/right2.png";

const socket = io("http://localhost:4000"); // Change to your server URL

const canvasWidth = 800;
const canvasHeight = 600;
const playerSize = 50;

type Player = {
  username: string;
  x: number;
  y: number;
  trap: number;
  flash: boolean;
  direction : string;
};

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
  const [lastDirection, setLastDirection] = useState<string>("right")
  const playerImages = useRef<{ [key: string]: HTMLImageElement[] }>({});
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);



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
    const loadImages = () => {
      const images: { [key: string]: HTMLImageElement[] } = {
        up: [new Image(), new Image()],
        down: [new Image(), new Image()],
        left: [new Image(), new Image()],
        right: [new Image(), new Image()],
      };

      images.up[0].src = up1.src;
      images.up[1].src = up2.src;
      images.down[0].src = down1.src;
      images.down[1].src = down2.src;
      images.left[0].src = left1.src;
      images.left[1].src = left2.src;
      images.right[0].src = right1.src;
      images.right[1].src = right2.src;

      Object.values(images).flat().forEach((img) => {
        img.onload = () => {
          playerImages.current = images;
        };
      });
    };

    loadImages();
  }, []);

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
    
      Object.entries(players).forEach(([id, player]) => {     
        const frames = playerImages.current[player.direction]; // Get correct direction sprites
        console.log("frames:", frames);
    
        if (!frames) {
          return;
        }
    
        const sprite = isMoving ? frames[animationFrame] : frames[0]; // Choose frame
    
        if (sprite) {
          ctx.drawImage(sprite, player.x, player.y, playerSize, playerSize);
        } else {
          ctx.fillStyle = id === socket.id ? "blue" : "red";
          ctx.fillRect(player.x, player.y, playerSize, playerSize);
        }
      });
    
      // Draw arrows
      arrows.forEach((arrow) => {
        ctx.fillStyle = "black";
        ctx.fillRect(arrow.x, arrow.y, 10, 20);
      });
    };
    draw();
  }, [players, arrows, gameStarted]);

  useEffect(() => {
    if (!gameStarted) return;

    const updatePlayers = (updatedPlayers: { [id: string]: Player }) => {
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

  useEffect(() => {
    if (!gameStarted) return;

    const movementInterval = setInterval(() => {
      let directionChanged = false;

      if (keys.w.pressed) {
        socket.emit("move", { key: "w", playerDirection: "up" });
      }
      if (keys.a.pressed) {
        socket.emit("move", { key: "a", playerDirection: "left" });
      }
      if (keys.s.pressed) {
        socket.emit("move", { key: "s", playerDirection: "down" });
      }
      if (keys.d.pressed) {
        socket.emit("move", { key: "d", playerDirection: "right" });
      }
    }, 15);

    return () => clearInterval(movementInterval);
  }, [gameStarted]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (!gameStarted) return;
    let key = e.key;
    if (!["w", "a", "s", "d", "f"].includes(key)) return;
  
    setIsMoving(true); // Player is moving
  
    switch (key) {
      case "w":
        keys.w.pressed = true;
        setLastDirection("up");
        break;
      case "a":
        keys.a.pressed = true;
        setLastDirection("left");
        break;
      case "s":
        keys.s.pressed = true;
        setLastDirection("down");
        break;
      case "d":
        keys.d.pressed = true;
        setLastDirection("right");
        break;
      case "f":
        socket.emit("flash");
        break;
    }
  };
  
  const handleKeyUp = (e: KeyboardEvent) => {
    let key = e.key;
    if (!["w", "a", "s", "d"].includes(key)) return;
  
    setIsMoving(false); // Player stops moving
  
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
    const interval = setInterval(() => {
      if (isMoving) {
        setAnimationFrame((prev) => (prev === 0 ? 1 : 0)); // Toggle between 0 and 1
      }
    }, 200); // Adjust speed as needed
  
    return () => clearInterval(interval);
  }, [isMoving]);  
  

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
