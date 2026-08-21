'use client';

import { useEffect, useRef } from 'react';

import styles from './particlePlanet.module.css';

type Point3D = {
    x: number;
    y: number;
    z: number;
};

const POINT_COUNT = 420;
const BASE_ROTATION_SPEED = 0.00012;
const HOVER_ROTATION_SPEED = 0.00028;
const SPHERE_RADIUS = 145;

function createSpherePoints(total: number): Point3D[] {
    const points: Point3D[] = [];
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    for (let index = 0; index < total; index += 1) {
        const normalizedIndex = index / Math.max(total - 1, 1);
        const y = 1 - normalizedIndex * 2;
        const horizontalRadius = Math.sqrt(1 - y * y);
        const angle = goldenAngle * index;

        points.push({
            x: Math.cos(angle) * horizontalRadius,
            y,
            z: Math.sin(angle) * horizontalRadius,
        });
    }

    return points;
}

export default function ParticlePlanet() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const hoverRef = useRef(false);

    useEffect(() => {
        const canvas = canvasRef.current;

        if (!canvas) {
            return;
        }

        const context = canvas.getContext('2d');

        if (!context) {
            return;
        }

        const points = createSpherePoints(POINT_COUNT);
        const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        let animationFrameId: number | null = null;
        let rotation = 0;
        let previousTimestamp = performance.now();
        let isVisible = false;

        const resizeCanvas = () => {
            const bounds = canvas.getBoundingClientRect();
            const pixelRatio = Math.min(window.devicePixelRatio, 2);

            canvas.width = Math.round(bounds.width * pixelRatio);
            canvas.height = Math.round(bounds.height * pixelRatio);

            context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
        };

        const drawPlanet = () => {
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            const centerX = width / 2;
            const centerY = height / 2;
            const isHovered = hoverRef.current;

            context.clearRect(0, 0, width, height);

            const rotationCosine = Math.cos(rotation);
            const rotationSine = Math.sin(rotation);

            const projectedPoints = points
                .map((point) => {
                    const rotatedX = point.x * rotationCosine - point.z * rotationSine;

                    const rotatedZ = point.x * rotationSine + point.z * rotationCosine;

                    const depth = (rotatedZ + 1) / 2;
                    const perspective = 0.74 + depth * 0.26;

                    return {
                        x: centerX + rotatedX * SPHERE_RADIUS * perspective,
                        y: centerY + point.y * SPHERE_RADIUS * perspective,
                        z: rotatedZ,
                        depth,
                    };
                })
                .sort((firstPoint, secondPoint) => firstPoint.z - secondPoint.z);

            for (const point of projectedPoints) {
                const primaryLight = Math.max(0, point.depth * 0.8 + (point.x / width) * 0.2);

                const secondaryLight = isHovered ? Math.max(0, 1 - point.depth) * 0.22 : 0;

                const opacity = Math.min(0.18 + point.depth * 0.68 + primaryLight * 0.12 + secondaryLight, 1);

                const radius = 0.45 + point.depth * 1.05;

                context.beginPath();
                context.arc(point.x, point.y, radius, 0, Math.PI * 2);
                context.fillStyle = `rgba(220, 226, 255, ${opacity})`;
                context.fill();
            }
        };

        const handleResize = () => {
            resizeCanvas();
            drawPlanet();
        };

        const animate = (timestamp: number) => {
            const elapsedTime = timestamp - previousTimestamp;
            previousTimestamp = timestamp;

            const rotationSpeed = hoverRef.current ? HOVER_ROTATION_SPEED : BASE_ROTATION_SPEED;

            rotation += elapsedTime * rotationSpeed;

            drawPlanet();

            animationFrameId = window.requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (animationFrameId !== null || reducedMotionQuery.matches) {
                return;
            }

            previousTimestamp = performance.now();
            animationFrameId = window.requestAnimationFrame(animate);
        };

        const stopAnimation = () => {
            if (animationFrameId === null) {
                return;
            }

            window.cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        };

        const visibilityObserver = new IntersectionObserver(
            ([entry]) => {
                isVisible = entry.isIntersecting;

                if (isVisible) {
                    drawPlanet();
                    startAnimation();
                    return;
                }

                stopAnimation();
            },
            {
                threshold: 0.1,
            },
        );

        const handleReducedMotionChange = () => {
            if (reducedMotionQuery.matches) {
                stopAnimation();
                drawPlanet();
                return;
            }

            if (isVisible) {
                startAnimation();
            }
        };

        resizeCanvas();
        drawPlanet();

        visibilityObserver.observe(canvas);
        reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
        window.addEventListener('resize', handleResize);

        return () => {
            stopAnimation();
            visibilityObserver.disconnect();
            reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    return (
        <div
            className={styles.planet}
            onPointerEnter={() => {
                hoverRef.current = true;
            }}
            onPointerLeave={() => {
                hoverRef.current = false;
            }}
        >
            <canvas ref={canvasRef} className={styles.canvas} />
        </div>
    );
}
