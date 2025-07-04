// src/components/CanvasBackground.js
import React, { useRef, useEffect } from "react";
import ancla from "../assets/comida/ancla.png";
import barco from "../assets/comida/barco.png";
import comidaRapida from "../assets/comida/fast-food.png";
import leche from "../assets/comida/leche.png";
import pan from "../assets/comida/pan.png";
import queso from "../assets/comida/queso.png";

const foodImages = [ancla, barco, comidaRapida, pan, queso, leche];

function CanvasBackground() {
    const canvasRef = useRef(null);
    const imageObjects = useRef([]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext("2d");

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener("resize", resizeCanvas);

        const totalPerImage = 5; // cantidad de objetos por cada imagen
        let loadedCount = 0;
        const totalObjects = foodImages.length * totalPerImage;

        // Vaciar arreglo en caso de remount
        imageObjects.current = [];

        foodImages.forEach((src) => {
            const img = new Image();
            img.src = src;
            img.onload = () => {
                for (let i = 0; i < totalPerImage; i++) {
                    imageObjects.current.push({
                        img,
                        x: Math.random() * canvas.width,
                        y: Math.random() * canvas.height,
                        dx: (Math.random() - 0.5) * 0.5,  // velocidad horizontal
                        dy: (Math.random() - 0.5) * 0.5,  // velocidad vertical
                        rotation: Math.random() * Math.PI * 2, // ángulo inicial de rotación
                        rotationSpeed: (Math.random() - 0.5) * 0.02, // velocidad rotación
                        size: 40 + Math.random() * 20,
                    });
                }
                loadedCount += totalPerImage;
                if (loadedCount >= totalObjects) {
                    draw(); // iniciar animación cuando todas estén listas
                }
            };
        });

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Fondo degradado
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, "#fceabb");
            gradient.addColorStop(1, "#f8b500");
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            imageObjects.current.forEach((item) => {
                // Actualizar posición
                item.x += item.dx;
                item.y += item.dy;

                // Rebote horizontal
                if (item.x <= 0 || item.x + item.size >= canvas.width) item.dx *= -1;
                // Rebote vertical
                if (item.y <= 0 || item.y + item.size >= canvas.height) item.dy *= -1;

                // Actualizar rotación
                item.rotation += item.rotationSpeed;

                // Dibujar imagen rotada
                ctx.save();
                ctx.translate(item.x + item.size / 2, item.y + item.size / 2);
                ctx.rotate(item.rotation);
                ctx.drawImage(item.img, -item.size / 2, -item.size / 2, item.size, item.size);
                ctx.restore();
            });

            requestAnimationFrame(draw);
        };

        return () => {
            window.removeEventListener("resize", resizeCanvas);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                zIndex: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
            }}
        />
    );
}

export default CanvasBackground;