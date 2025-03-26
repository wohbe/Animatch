import React, { useEffect, useRef, useState } from "react";

const MediaScroller = ({ images = [], scrollItems = 1 }) => {
    // Refs to access DOM elements
    const mediaScrollerRef = useRef(null); // The scrollable container
    const containerRef = useRef(null);     // Main wrapper div

    // State variables
    const [showPrevious, setShowPrevious] = useState(false); // Show/hide prev button
    const [showNext, setShowNext] = useState(false);       // Show/hide next button
    const [isScrolled, setIsScrolled] = useState(false);   // Track if user has scrolled
    const [visibleItemsCount, setVisibleItemsCount] = useState(0); // How many items fit on screen
    const [isAtEnd, setIsAtEnd] = useState(false);         // Track if scrolled to end

    // Calculate how many items are visible in the viewport
    useEffect(() => {
        const calculateVisibleItems = () => {
            if (mediaScrollerRef.current && images.length > 0) {
                const containerWidth = mediaScrollerRef.current.clientWidth;
                const firstElement = mediaScrollerRef.current.querySelector('.mediaElement');

                if (firstElement) {
                    const elementWidth = firstElement.offsetWidth;
                    const gap = 32; // Fixed gap between items (2rem in pixels)
                    // Calculate how many full items fit in the container
                    const count = Math.floor(containerWidth / (elementWidth + gap));
                    setVisibleItemsCount(count > 0 ? count : 1); // Always show at least 1
                }
            }
        };

        calculateVisibleItems(); // Run immediately
        window.addEventListener('resize', calculateVisibleItems); // Update on resize

        return () => window.removeEventListener('resize', calculateVisibleItems);
    }, [images]); // Re-run when images array changes

    // Check scroll position and update button visibility
    const checkScroll = () => {
        if (mediaScrollerRef.current) {
            const { scrollLeft, scrollWidth, clientWidth } = mediaScrollerRef.current;
            const atEnd = scrollLeft + clientWidth >= scrollWidth - 10; // 10px buffer

            setShowPrevious(scrollLeft > 0); // Show previous if scrolled right
            setIsScrolled(scrollLeft > 0);   // Track if scrolled from start
            setIsAtEnd(atEnd);               // Update end status
            setShowNext(!atEnd);             // Hide next button at end
        }
    };

    // Set up scroll/resize listeners
    useEffect(() => {
        const mediaScroller = mediaScrollerRef.current;
        checkScroll(); // Initial check

        mediaScroller.addEventListener("scroll", checkScroll);
        window.addEventListener("resize", checkScroll);

        return () => {
            mediaScroller.removeEventListener("scroll", checkScroll);
            window.removeEventListener("resize", checkScroll);
        };
    }, []); // Empty dependency array = runs once on mount

    // Handle scroll button clicks
    const scroll = (direction) => {
        if (!mediaScrollerRef.current || visibleItemsCount === 0) return;

        const firstElement = mediaScrollerRef.current.querySelector('.mediaElement');
        if (!firstElement) return;

        const elementWidth = firstElement.offsetWidth;
        const gap = 32; // Same as in calculateVisibleItems
        // Scroll by the width of visible items
        const scrollAmount = (elementWidth + gap) * visibleItemsCount;

        mediaScrollerRef.current.scrollBy({
            left: direction === "next" ? scrollAmount : -scrollAmount,
            behavior: "smooth", // Animated scrolling
        });
    };

    return (
        <div
            className="image-cards container-fluid"
            ref={containerRef}
            style={{
                // Dynamic padding based on scroll position:
                paddingLeft: !isScrolled ? '50px' : '0px',  // Initial left padding
                paddingRight: isAtEnd ? '50px' : '0px',     // Padding at end
                transition: 'padding 0.3s ease'            // Smooth padding changes
            }}
        >
            <div className="mediaContainer">
                {/* Scrollable items container */}
                <div
                    className={`mediaScroller ${isScrolled ? 'scrolled' : ''}`}
                    ref={mediaScrollerRef}
                >
                    {images.map((image, index) => (
                        <div className="mediaElement" key={index}>
                            <img src={image} alt={`Image ${index + 1}`} />
                        </div>
                    ))}
                </div>

                {/* Previous button - only shows when scrolled right */}
                {showPrevious && (
                    <button
                        className="previous"
                        onClick={() => scroll("previous")}
                        aria-label="previous"
                    >
                        <svg>
                            <use href="#previous"></use>
                        </svg>
                    </button>
                )}

                {/* Next button - hides when at the end */}
                {showNext && !isAtEnd && (
                    <button
                        className="next"
                        onClick={() => scroll("next")}
                        aria-label="next"
                    >
                        <svg>
                            <use href="#next"></use>
                        </svg>
                    </button>
                )}
            </div>
        </div>
    );
};

export default MediaScroller;