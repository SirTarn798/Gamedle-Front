"use client"

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

  useEffect(() => {
    socket.emit("findMatch");
    
    socket.on("matchFound", () => {
      console.log("Match found!");
    });
    
    socket.on("updatePlayers", (updatedPlayers) => {
      setPlayers(updatedPlayers);
    });
    
    socket.on("spawnArrow", (arrow) => {
      setArrows((prev) => [...prev, arrow]);
    });
    
    socket.on("updateArrows", (updatedArrows) => {
      setArrows(updatedArrows);
    });
    
    socket.on("playerHit", ({ playerId }) => {
      console.log(`Player ${playerId} was hit!`);
    });

    return () => {
      socket.off("matchFound");
      socket.off("updatePlayers");
      socket.off("spawnArrow");
      socket.off("updateArrows");
      socket.off("playerHit");
    };
  }, []);

  useEffect(() => {
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
  }, [players, arrows]);

  const handleKeyDown = (e: KeyboardEvent) => {
    let newPos = { ...players[socket.id] };
    if (!newPos) return;

    if (e.key === "ArrowLeft" && newPos.x > 0) newPos.x -= 10;
    if (e.key === "ArrowRight" && newPos.x < canvasWidth - playerSize) newPos.x += 10;
    if (e.key === "ArrowUp" && newPos.y > 0) newPos.y -= 10;
    if (e.key === "ArrowDown" && newPos.y < canvasHeight - playerSize) newPos.y += 10;

    socket.emit("move", { roomId: "some_room_id", position: newPos });
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [players]);

  return <canvas ref={canvasRef} width={canvasWidth} height={canvasHeight} style={{ border: "1px solid black" }} />;
}
