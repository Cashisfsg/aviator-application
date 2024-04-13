import React, { useRef, useState, useEffect } from "react";

export function ZoomableImage({ src, alt }) {
    const zoomableImageRef = useRef(null);
    const [initialTouchDistance, setInitialTouchDistance] = useState(0);
    const [initialScale, setInitialScale] = useState(1);

    // Event listener for touch start
    const handleTouchStart = event => {
        const touches = event.touches;
        if (touches.length === 2) {
            // Calculate initial distance between touches
            const touchDistance = Math.abs(
                touches[0].clientX - touches[1].clientX
            );
            setInitialTouchDistance(touchDistance);
            // Store initial scale
            setInitialScale(
                zoomableImageRef.current.style.transform
                    ? parseFloat(
                          zoomableImageRef.current.style.transform.match(
                              /scale\((\d+(\.\d+)?)\)/
                          )[1]
                      )
                    : 1
            );
        }
    };

    // Event listener for touch move
    const handleTouchMove = event => {
        const touches = event.touches;
        if (touches.length === 2 && initialTouchDistance > 0) {
            // Calculate current distance between touches
            const currentTouchDistance = Math.abs(
                touches[0].clientX - touches[1].clientX
            );
            // Calculate the scale factor based on the change in touch distance
            const scaleFactor = currentTouchDistance / initialTouchDistance;
            // Scale the image proportionally
            zoomableImageRef.current.style.transform = `scale(${
                initialScale * scaleFactor
            })`;
        }
    };

    // Event listener for touch end
    const handleTouchEnd = () => {
        // Reset touch variables
        setInitialTouchDistance(0);
        setInitialScale(1);
    };

    useEffect(() => {
        const handleBodyTouchMove = event => {
            if (zoomableImageRef.current.contains(event.target)) {
                event.preventDefault();
            }
        };

        document.body.addEventListener("touchmove", handleBodyTouchMove, {
            passive: false
        });

        return () => {
            document.body.removeEventListener("touchmove", handleBodyTouchMove);
        };
    }, []);

    return (
        <img
            ref={zoomableImageRef}
            src={src}
            alt={alt}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
        />
    );
}
