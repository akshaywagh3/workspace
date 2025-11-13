import React, { useRef, useEffect, useState } from "react";
import socket from "../socket"; // your initialized socket.io client

export default function Whiteboard({ workspaceId }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState("pen"); // pen | eraser | line | rect | circle
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [startPos, setStartPos] = useState(null);
  const [previewCanvas, setPreviewCanvas] = useState(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = window.innerWidth - 100;
    canvas.height = window.innerHeight - 150;

    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctxRef.current = ctx;

    // Join workspace room
    socket.emit("joinWorkspace", workspaceId);

    // Listen for incoming drawings
    socket.on("drawing", ({ workspaceId: wsId, drawingData }) => {
      if (wsId !== workspaceId) return;
      const { x0, y0, x1, y1, tool, color, brushSize } = drawingData;
      drawOnCanvas(x0, y0, x1, y1, tool, color, brushSize, false);
    });

    // Listen for clear command
    socket.on("clearBoard", ({ workspaceId: wsId }) => {
      if (wsId === workspaceId) clearBoard(false);
    });

    return () => {
      socket.off("drawing");
      socket.off("clearBoard");
    };
  }, [workspaceId]);

  useEffect(() => {
    if (ctxRef.current) {
      ctxRef.current.strokeStyle = color;
      ctxRef.current.lineWidth = brushSize;
    }
  }, [color, brushSize]);

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    setIsDrawing(true);
    setStartPos({ x: offsetX, y: offsetY });
  };

  const finishDrawing = () => {
    setIsDrawing(false);
    setStartPos(null);
    ctxRef.current.beginPath();
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;

    if (tool === "pen" || tool === "eraser") {
      drawOnCanvas(
        startPos?.x || offsetX,
        startPos?.y || offsetY,
        offsetX,
        offsetY,
        tool,
        tool === "eraser" ? "#FFFFFF" : color,
        brushSize,
        true
      );
      setStartPos({ x: offsetX, y: offsetY });
    } else {
      // show live preview of shapes
      const ctx = ctxRef.current;
      const canvas = canvasRef.current;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (previewCanvas) ctx.drawImage(previewCanvas, 0, 0);
      drawOnCanvas(startPos.x, startPos.y, offsetX, offsetY, tool, color, brushSize, false);
    }
  };

  const handleMouseUp = ({ nativeEvent }) => {
    if (!isDrawing || !startPos) return;

    const { offsetX, offsetY } = nativeEvent;

    // Save current state for previews
    const ctx = ctxRef.current;
    const canvas = canvasRef.current;
    const snapshot = document.createElement("canvas");
    snapshot.width = canvas.width;
    snapshot.height = canvas.height;
    snapshot.getContext("2d").drawImage(canvas, 0, 0);
    setPreviewCanvas(snapshot);

    if (tool !== "pen" && tool !== "eraser") {
      drawOnCanvas(
        startPos.x,
        startPos.y,
        offsetX,
        offsetY,
        tool,
        color,
        brushSize,
        true
      );
    }

    finishDrawing();
  };

  const drawOnCanvas = (x0, y0, x1, y1, tool, color, brushSize, emit) => {
    const ctx = ctxRef.current;
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;

    ctx.beginPath();
    if (tool === "line") {
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    } else if (tool === "rect") {
      ctx.strokeRect(x0, y0, x1 - x0, y1 - y0);
    } else if (tool === "circle") {
      const radius = Math.sqrt((x1 - x0) ** 2 + (y1 - y0) ** 2);
      ctx.arc(x0, y0, radius, 0, 2 * Math.PI);
    } else {
      ctx.moveTo(x0, y0);
      ctx.lineTo(x1, y1);
    }
    ctx.stroke();
    ctx.closePath();

    if (!emit) return;
    socket.emit("drawing", {
      workspaceId,
      drawingData: { x0, y0, x1, y1, tool, color, brushSize },
    });
  };

  const clearBoard = (emit = true) => {
    const canvas = canvasRef.current;
    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);
    setPreviewCanvas(null);
    if (emit) socket.emit("clearBoard", { workspaceId });
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ marginBottom: "10px" }}>
        <button onClick={() => setTool("pen")}>✏️ Pen</button>
        <button onClick={() => setTool("eraser")}>🩹 Eraser</button>
        <button onClick={() => setTool("line")}>📏 Line</button>
        <button onClick={() => setTool("rect")}>⬛ Rectangle</button>
        <button onClick={() => setTool("circle")}>⚪ Circle</button>

        <input
          type="color"
          value={color}
          onChange={(e) => setColor(e.target.value)}
          style={{ marginLeft: "10px" }}
        />

        <input
          type="range"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
          style={{ marginLeft: "10px" }}
        />

        <button onClick={() => clearBoard()} style={{ marginLeft: "10px" }}>
          🧹 Clear
        </button>
      </div>

      <canvas
        ref={canvasRef}
        style={{
          border: "2px solid black",
          background: "white",
          cursor: tool === "eraser" ? "crosshair" : "default",
        }}
        onMouseDown={startDrawing}
        onMouseUp={handleMouseUp}
        onMouseMove={draw}
      />
    </div>
  );
}
