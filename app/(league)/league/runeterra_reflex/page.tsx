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
import arrow from "@/public/arrow.png";
import hitArrow from "@/public/HitArrow.png";
import flash from "@/public/Flash.png";
import { drawLevelIndicator } from "@/lib/drawingFuncs";
import { toast, ToastContentProps } from "react-toastify";
import Toast from "@/app/components/Toast";

const socket = io("http://localhost:4000"); // Change to your server URL

const arrowSprite = new Image();
const hitArrowSprite = new Image();
const flashSprite = new Image();
arrowSprite.src = arrow.src;
hitArrowSprite.src = hitArrow.src;
flashSprite.src = flash.src;
const canvasWidth = 800;
const canvasHeight = 600;
const playerSize = 50;
const arrowSize = 70;
const projectileRadius = 25;

type Room = {
  roomId: string;
  private: boolean;
  players: Record<string, Player>;
  status: "ongoing" | "waiting";
  owner: string;
  projectiles: Record<string, Projectile>;
  level: number;
} | null;

type Player = {
  username: string;
  x: number;
  y: number;
  trap: number;
  flash: boolean;
  direction: string;
  health: 0 | 1 | 2 | 3;
  invulnerable: boolean;
  status: "alive" | "dead" | "disconnected";
};

type Projectile = {
  id: string;
  x: number;
  y: number;
  angle: number;
  hit: boolean;
};

// Define a GameState type to make state management clearer
type GameState = "menu" | "queuing" | "waitingRoom" | "playing";

socket.emit("register", { username: "TarnJirayu" });

export default function RuneterraReflexCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameState, setGameState] = useState<GameState>("menu");
  const [room, setRoom] = useState<Room>(null);
  const [joinRoomId, setJoinRoomId] = useState("");
  const [playerInformation, setPlayerInformation] =
    useState<Record<string, { username: string; health: 0 | 1 | 2 | 3 }>>();
  const playerImages = useRef<{ [key: string]: HTMLImageElement[] }>({});
  const [animationFrame, setAnimationFrame] = useState(0);
  const [isMoving, setIsMoving] = useState(false);
  const [hoveredPlayer, setHoveredPlayer] = useState<string | null>(null);
  const [flash, setFlash] = useState<boolean>(false);
  const [flashCount, setFlashCount] = useState<number>(20);
  const [flashCooldown, setFlashCooldown] = useState<number>(0);

  const handleQueueUp = () => {
    socket.emit("findMatch", { username: "x" });
    setGameState("queuing");

    socket.on("matchFound", (room: Room) => {
      console.log("Match found! Room:", room?.roomId);
      setRoom(room);
      console.log(room);
      setPlayerInformation(
        Object.entries(room?.players || {}).reduce<
          Record<string, { username: string; health: 0 | 1 | 2 | 3 }>
        >((acc, [id, player]) => {
          acc[id] = { username: player.username, health: player.health }; // Add more properties if needed
          return acc;
        }, {})
      );

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

  const handleKick = (id: string) => {
    socket.emit("kick", { kick: id });
  };

  const handleStartRoom = () => {
    socket.emit("startRoom", { roomId: room?.roomId });
  };

  socket.on("playerJoin", (data) => {
    setRoom(data.room);
  });

  socket.on("error", (data) => {
    toast.error(`${data.error}`, {toastId : "error"})
  });

  socket.on("flashed", () => {
    setFlash(true);
    setFlashCooldown(10);
  });

  socket.on("roomStarted", () => {
    setPlayerInformation(
      Object.entries(room?.players || {}).reduce<
        Record<string, { username: string; health: 0 | 1 | 2 | 3 }>
      >((acc, [id, player]) => {
        acc[id] = { username: player.username, health: player.health }; // Add more properties if needed
        return acc;
      }, {})
    );
    setGameState("playing");
  });

  socket.on("kicked", () => {
    setGameState("menu");
    toast.info("You got kicked ✌😭", {toastId : "kicked"})
    setRoom(null);
  });

  socket.on("gameResult", (data) => {
    toast(
      Toast({
        title: "Game Result",
        text: `${
          data.place === 1 ? "💪🤴" : data.place === 2 ? "🤏✨" : "💀😭"
        } You got ${
          data.place === 1 ? "1st" : data.place === 2 ? "2nd" : "3rd"
        } place.`,
        bg:
          data.place === 1
            ? "bg-lime-400"
            : data.place === 2
            ? "bg-amber-300"
            : "bg-red-500",
      }),
      {closeButton : true,
        position : "top-center",
        toastId : "gamresult",
      }
    );
    setRoom(null);
    setGameState("menu");
    
  });

  
  useEffect(() => {
    let timer: any;

    if (flashCooldown > 0) {
      timer = setInterval(() => {
        setFlashCooldown((prevCount) => {
          if (prevCount <= 1) {
            clearInterval(timer);
            setFlash(false);
            return 0;
          }
          return prevCount - 1;
        });
      }, 1000);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [flashCooldown]);

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
      const players = room?.players ?? {};
      const projectiles = room?.projectiles;

      Object.entries(players).forEach(([id, player]) => {
        const frames = playerImages.current[player.direction]; // Get correct direction sprites

        if (!frames || player.status === "dead" || player.status === "disconnected") {
          return;
        }

        // Check if player is invulnerable and should be visible in the blink cycle
        const isVisible =
          !player.invulnerable || Math.floor(Date.now() / 100) % 2 === 0;

        if (isVisible) {
          const sprite = isMoving ? frames[animationFrame] : frames[0]; // Choose frame
          const playerX = player.x - playerSize / 2;
          const playerY = player.y - playerSize / 2;

          if (sprite) {
            // If player is invulnerable but visible, make it semi-transparent
            if (player.invulnerable) {
              ctx.globalAlpha = 0.5; // 50% opacity for invulnerable players
            }
            if (flashCount <= 0) {
              setFlash(false);
              setFlashCount(20);
            }
            flash && id === socket.id
              ? ctx.drawImage(
                  flashSprite,
                  playerX,
                  playerY,
                  playerSize,
                  playerSize
                )
              : ctx.drawImage(sprite, playerX, playerY, playerSize, playerSize);
            if (flash) {
              setFlashCount((prev) => {
                return prev - 1;
              });
            }
            // Reset opacity for other elements
            if (player.invulnerable) {
              ctx.globalAlpha = 1.0;
            }

            ctx.fillStyle = socket.id == id ? "yellow" : "white";
            ctx.fillText(player.username, playerX, playerY + 5);

            ctx.save();
            drawLevelIndicator(ctx, room?.level || 0, 330, 50);
            ctx.restore();
          } else {
            ctx.fillStyle = id === socket.id ? "blue" : "red";
            if (player.invulnerable) {
              ctx.globalAlpha = 0.5;
            }
            ctx.fillRect(playerX, playerY, playerSize, playerSize);
            ctx.globalAlpha = 1.0;
          }
        }
      });

      // Draw arrows
      if (projectiles) {
        Object.entries(projectiles).forEach(([id, projectile]) => {
          ctx.save();
          ctx.translate(projectile.x, projectile.y);
          ctx.rotate(projectile.angle + Math.PI / 2);
          !projectile.hit
            ? ctx.drawImage(
                arrowSprite,
                -arrowSize / 2,
                -arrowSize / 2,
                arrowSize,
                arrowSize
              )
            : ctx.drawImage(
                hitArrowSprite,
                -arrowSize / 2,
                -arrowSize / 2,
                arrowSize,
                arrowSize
              );
          ctx.restore();
        });
      }
      //Show hit box if enable
      const showHitboxes = false;

      if (showHitboxes) {
        // Draw hitboxes
        Object.entries(players).forEach(([id, player]) => {
          const playerRadius = playerSize / 2;
          ctx.beginPath();
          ctx.arc(player.x, player.y, playerRadius, 0, Math.PI * 2);
          ctx.strokeStyle = socket.id === id ? "yellow" : "red";
          ctx.lineWidth = 2;
          ctx.stroke();
        });

        if (projectiles) {
          Object.entries(projectiles).forEach(([id, projectile]) => {
            ctx.beginPath();
            ctx.arc(
              projectile.x,
              projectile.y,
              projectileRadius,
              0,
              Math.PI * 2
            );
            ctx.strokeStyle = "orange";
            ctx.lineWidth = 2;
            ctx.stroke();
          });
        }
      }
    };
    draw();
  }, [room, gameState]);

  useEffect(() => {
    if (gameState !== "playing") return;

    const updateRoom = (room: Room) => {
      setRoom(room);
    };

    socket.on("updateRoom", (room) => {
      updateRoom(room);
    });

    return () => socket.off("updateRoom");
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
              <div className="flex flex-col gap-1 w-full items-center">
                <h1 className="text-3xl">Room : {room?.roomId}</h1>
                <h1
                  className={`text-3xl ${
                    room?.players && Object.keys(room.players).length === 3
                      ? "text-acceptGreen"
                      : "text-cancelRed"
                  }`}
                >
                  Players : {room?.players && Object.keys(room.players).length}
                  /3
                </h1>
              </div>
              <div className="flex justify-center gap-10">
                {room?.players &&
                  Object.entries(room.players).map(([id, player]) => (
                    <div
                      key={id}
                      className="flex flex-col items-center"
                      onClick={() =>
                        socket.id !== room.owner || id === room.owner
                          ? null
                          : handleKick(id)
                      }
                      onMouseEnter={() => setHoveredPlayer(id)} // Track hovered player
                      onMouseLeave={() => setHoveredPlayer(null)}
                    >
                      <img
                        src={
                          hoveredPlayer === id &&
                          id !== room.owner &&
                          socket.id === room.owner
                            ? "/KickPlayer.png"
                            : "/user.png"
                        }
                        height={75}
                        width={75}
                        alt=""
                      />
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
              {socket.id === room?.owner ? (
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
                </button>
              ) : null}
            </div>
          </div>
        );

      case "playing":
        return (
          <div className="flex">
            <div className="flex flex-col gap-3 w-full">
              {Object.entries(room?.players || {}).map(([id, player]) => (
                <div
                  key={id}
                  className="bg-mainTheme p-5 border border-4 border-white"
                >
                  <p
                    className={
                      id === socket.id ? "text-yellow-300" : "text-white"
                    }
                  >
                    {player.username}{" "}
                    <span
                      className={`font-medium ${
                        player.status === "disconnected"
                          ? "text-stone-400"
                          : player.status === "alive"
                          ? "text-green-400"
                          : "text-red-500"
                      }`}
                    >
                      (
                      {player.status[0].toLocaleUpperCase() +
                        player.status.slice(1)}
                      )
                    </span>
                  </p>
                  <div className="flex gap-2">
                    {[...Array(3)].map((_, index) => (
                      <img
                        key={index}
                        src={
                          index < player.health
                            ? "/FullHeart.png"
                            : "/DamagedHeart.png"
                        }
                        alt={
                          index < player.health ? "Full Heart" : "Damaged Heart"
                        }
                        className="w-6 h-6"
                      />
                    ))}
                  </div>
                </div>
              ))}
              <div className="relative inline-block flex justify-center items-center bg-mainTheme p-5 borber border-4 border-white">
                {/* Flash icon */}
                <img
                  src="/FlashIcon.webp"
                  alt="Flash"
                  className={`borber border-4 border-yellow-300 w-16 h-16 ${
                    flashCooldown > 0 ? "opacity-50 grayscale" : ""
                  }`}
                />

                {/* Countdown overlay - fixed positioning */}
                {flashCooldown > 0 && (
                  <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center">
                    <div className="p-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full w-10 h-10">
                      <span className="p-0 text-2xl font-bold text-white">
                        {flashCooldown}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <canvas
              ref={canvasRef}
              width={canvasWidth}
              height={canvasHeight}
              style={{ border: "1px solid black" }}
            />
          </div>
        );

      default:
        return <div>Something went wrong!</div>;
    }
  };

  return renderGameUI();
}
