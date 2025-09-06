'use client';

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';

interface IndecisiveHeroProps {
  brandText: string;
  backgroundImageUrl: string;
  modelImageUrl: string;
}

export const IndecisiveHero = ({ brandText, backgroundImageUrl, modelImageUrl }: IndecisiveHeroProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        function adjustContentSize() {
            if (contentRef.current) {
                const viewportWidth = window.innerWidth;
                const baseWidth = 1000;
                const scaleFactor = viewportWidth < baseWidth ? (viewportWidth / baseWidth) * 0.9 : 1;
                contentRef.current.style.transform = `scale(${scaleFactor})`;
            }
        }

        adjustContentSize();
        window.addEventListener("resize", adjustContentSize);
        return () => window.removeEventListener("resize", adjustContentSize);
    }, []);

    return (
        <header className="hero-section">
            <div className="container">
                <div 
                    ref={contentRef} 
                    className="content" 
                    style={{ display: 'block', width: '1000px', height: '562px' }}
                >
                    <div className="container-full">
                        <div className="animated hue"></div>
                        <Image
                            className="backgroundImage"
                            src={backgroundImageUrl}
                            alt="Indecisive Wear streetwear lifestyle"
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                        <Image
                            className="boyImage"
                            src={modelImageUrl}
                            alt="Model wearing Indecisive Wear bucket hat"
                            width={300}
                            height={400}
                            style={{ objectFit: 'cover' }}
                        />
                        
                        <div className="container">
                            <div className="cube">
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                                <div className="face left text" dangerouslySetInnerHTML={{ __html: brandText }}></div>
                                <div className="face right text" dangerouslySetInnerHTML={{ __html: brandText }}></div>
                                <div className="face front"></div>
                                <div className="face back text" dangerouslySetInnerHTML={{ __html: brandText }}></div>
                            </div>
                        </div>

                        <div className="container-reflect">
                            <div className="cube">
                                <div className="face top"></div>
                                <div className="face bottom"></div>
                                <div className="face left text" dangerouslySetInnerHTML={{ __html: brandText }}></div>
                                <div className="face right text" dangerouslySetInnerHTML={{ __html: brandText }}></div>
                                <div className="face front"></div>
                                <div className="face back text" dangerouslySetInnerHTML={{ __html: brandText }}></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};