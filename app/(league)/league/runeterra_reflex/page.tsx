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
  direction: string;
};

interface Arrow {
  id: string;
  x: number;
  y: number;
}

type Room = {
  roomId: string;
  private: boolean;
  players: Record<string, Player>;
  status: "ongoing" | "waiting";
  owner: string;
} | null;

// Define a GameState type to make state management clearer
type GameState = "menu" | "queuing" | "waitingRoom" | "playing";

socket.emit("register", {username : "TarnJirayu"})

export default function RuneterraReflexCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [players, setPlayers] = useState<{ [id: string]: Player }>({});
  const [arrows, setArrows] = useState<Arrow[]>([]);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [room, setRoom] = useState<Room>(null);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [lastDirection, setLastDirection] = useState<string>("right");
  const playerImages = useRef<{ [key: string]: HTMLImageElement[] }>({});
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);

  const handleQueueUp = () => {
    socket.emit("findMatch", { username: "x" });
    setGameState("queuing");

    socket.on("matchFound", (room) => {
      console.log("Match found! Room:" , room.roomId);
      setRoom(room);
      setGameState("playing");
    });
  };

  const handleCancelQueue = () => {
    socket.emit("cancelQueue");
    setGameState("menu");
  };

  const handleLeaveRoom = () => {
    socket.emit("leaveRoom");
    setGameState("menu");
  };

  const handleCreateRoom = () => {
    socket.emit("createRoom");

    socket.on("roomCreated", ({ room }) => {
      console.log("Room created! Room ID:", room.roomId);
      setRoom(room);
      setGameState("waitingRoom");
    });
  };

  socket.on("playerJoin", (data) => {
    setRoom(data.room);
  });

  const handleJoinRoom = () => {
    if (!joinRoomId) return;
    socket.emit("joinRoom", { roomId: joinRoomId });

    socket.on("roomJoined", (data) => {
      console.log(data);
      console.log("Joined room:", data.room.roomId);
      setRoom(data.room);
      setGameState("waitingRoom");
    });
  };

  const handleStartRoom = () => {
    socket.emit("startRoom", {roomId : room?.roomId});
  }

  socket.on("error", (data) => {
    alert(data.error);
  });

  socket.on("roomStarted", () => {
    setGameState("playing");
  })

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

      Object.values(images)
        .flat()
        .forEach((img) => {
          img.onload = () => {
            playerImages.current = images;
          };
        });
    };

    loadImages();
  }, []);

  useEffect(() => {
    if (gameState !== "playing") return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      ctx.fillStyle = "#4CAF50";
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      Object.entries(players).forEach(([id, player]) => {
        const frames = playerImages.current[player.direction]; // Get correct direction sprites

        if (!frames) {
          return;
        }

        const sprite = isMoving ? frames[animationFrame] : frames[0]; // Choose frame

        if (sprite) {
          ctx.drawImage(sprite, player.x, player.y, playerSize, playerSize);
          ctx.fillStyle = socket.id == id ? "yellow" : "white";
          ctx.fillText(player.username, player.x, player.y + 5);
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
  }, [players, arrows, gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const updatePlayers = (updatedPlayers: { [id: string]: Player }) => {
      setPlayers(updatedPlayers);
    };

    socket.on("updatePlayers", (updatedPlayers) => {
      updatePlayers(updatedPlayers);
    });

    return () => socket.off("updatePlayers");
  }, [gameState]);

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
    if (gameState !== "playing") return;

    const movementInterval = setInterval(() => {
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
  }, [gameState]);

  const handleKeyDown = (e: KeyboardEvent) => {
    if (gameState !== "playing") return;
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
    if (gameState !== "playing") return;

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [gameState]);

  // Render appropriate UI based on game state
  const renderGameUI = () => {
    switch (gameState) {
      case "menu":
        return (
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
                className="border p-2 text-black"
              />
              <button onClick={handleJoinRoom} className="btn-primary">
                Join Room
              </button>
            </div>
          </div>
        );

      case "queuing":
        return (
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
        );

      case "waitingRoom":
        return (
          <div className="flex flex-col items-center gap-8 mt-12 w-2/6 p-5 pixelBorder-2 bg-mainTheme">
            <div className="flex flex-col items-center justify-center">
              <h1 className="text-3xl">Room: {room?.roomId}</h1>
              <div className="flex justify-center gap-10">
                {room?.players &&
                  Object.entries(room.players).map(([id, player]) => (
                    <div key={id} className="flex flex-col items-center">
                      <img src="/user.png" height={75} width={75} alt="" />
                      <p>{player.username}</p>
                    </div>
                  ))}
              </div>
              <button
                className="bg-cancelRed py-2 px-5 mt-4"
                onClick={handleLeaveRoom}
              >
                Leave Room
              </button>
              { socket.id === room?.owner ?
                <button
                  className={`py-2 px-5 mt-4 ${
                    !room?.players || Object.keys(room.players).length !== 3
                      ? "bg-mainTheme border-2 border-borderColor cursor-not-allowed"
                      : "bg-acceptGreen"
                  }`}
                  disabled={
                    !room?.players || Object.keys(room.players).length !== 3
                  }
                  onClick={handleStartRoom}
                >
                  Start game
                </button> : null
              }
            </div>
          </div>
        );

      case "playing":
        return (
          <canvas
            ref={canvasRef}
            width={canvasWidth}
            height={canvasHeight}
            style={{ border: "1px solid black" }}
          />
        );

      default:
        return <div>Something went wrong!</div>;
    }
  };

  return renderGameUI();
}
