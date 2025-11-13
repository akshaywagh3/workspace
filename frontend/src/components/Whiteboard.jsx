import React, { useEffect, useRef } from "react";
import socket from "../socket";

export default function Whiteboard({ workspaceId }) {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const drawing = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = 800;
    canvas.height = 600;
    const ctx = canvas.getContext("2d");
    ctx.lineCap = "round";
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;
    ctxRef.current = ctx;

    // Join workspace
    socket.emit("joinWorkspace", workspaceId);

    // Listen for drawing from others
    socket.on("draw", ({ drawingData }) => {
      drawLine(drawingData, ctx);
    });

    return () => {
      socket.off("draw");
    };
  }, [workspaceId]);

  const drawLine = (data, ctx) => {
    const { x0, y0, x1, y1 } = data;
    ctx.beginPath();
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  };

  const handleMouseDown = (e) => {
    drawing.current = true;
    ctxRef.current.beginPath();
    ctxRef.current.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
  };

  const handleMouseMove = (e) => {
    if (!drawing.current) return;

    const x = e.nativeEvent.offsetX;
    const y = e.nativeEvent.offsetY;
    const prevX = ctxRef.current.lastX || x;
    const prevY = ctxRef.current.lastY || y;

    drawLine({ x0: prevX, y0: prevY, x1: x, y1: y }, ctxRef.current);

    socket.emit("draw", {
      workspaceId,
      drawingData: { x0: prevX, y0: prevY, x1: x, y1: y },
    });

    ctxRef.current.lastX = x;
    ctxRef.current.lastY = y;
  };

  const handleMouseUp = () => {
    drawing.current = false;
    ctxRef.current.lastX = null;
    ctxRef.current.lastY = null;
  };

  return (
    <canvas
      ref={canvasRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      style={{ border: "1px solid black" }}
    />
  );
}
