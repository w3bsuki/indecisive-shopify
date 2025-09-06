'use client'

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';

// Register GSAP plugin
gsap.registerPlugin(ScrambleTextPlugin);

// Types
interface Project {
  id: number;
  artist: string;
  album: string;
  category: string;
  label: string;
  year: string;
  image?: string;
}

interface Config {
  timeZone?: string;
  timeUpdateInterval?: number;
  idleDelay?: number;
  debounceDelay?: number;
}

interface Location {
  latitude?: string;
  longitude?: string;
  display?: boolean;
}

interface SocialLinks {
  spotify?: string;
  email?: string;
  x?: string;
}

interface Callbacks {
  onProjectHover?: (project: Project) => void;
  onProjectLeave?: () => void;
  onContainerLeave?: () => void;
  onIdleStart?: () => void;
  onThemeChange?: (theme: string) => void;
}

interface TimeDisplayProps {
  CONFIG?: Config;
}

interface ProjectItemProps {
  project: Project;
  index: number;
  onMouseEnter: (index: number, imageUrl?: string) => void;
  onMouseLeave: () => void;
  isActive: boolean;
  isIdle: boolean;
}

interface MusicPortfolioProps {
  PROJECTS_DATA?: Project[];
  LOCATION?: Location;
  CALLBACKS?: Callbacks;
  CONFIG?: Config;
  SOCIAL_LINKS?: SocialLinks;
}

// Time Display Component
const TimeDisplay: React.FC<TimeDisplayProps> = ({ CONFIG = {} }) => {
  const [time, setTime] = useState({ hours: '', minutes: '', dayPeriod: '' });

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: CONFIG.timeZone,
        hour12: true,
        hour: "numeric",
        minute: "numeric",
        second: "numeric"
      };
      const formatter = new Intl.DateTimeFormat("en-US", options);
      const parts = formatter.formatToParts(now);
      
      setTime({
        hours: parts.find(part => part.type === "hour")?.value || '',
        minutes: parts.find(part => part.type === "minute")?.value || '',
        dayPeriod: parts.find(part => part.type === "dayPeriod")?.value || ''
      });
    };

    updateTime();
    const interval = setInterval(updateTime, CONFIG.timeUpdateInterval || 1000);
    return () => clearInterval(interval);
  }, [CONFIG.timeZone, CONFIG.timeUpdateInterval]);

  return (
    <time className="corner-item bottom-right" id="current-time">
      {time.hours}<span className="time-blink">:</span>{time.minutes} {time.dayPeriod}
    </time>
  );
};

// Project Item Component
const ProjectItem = React.forwardRef<HTMLLIElement, ProjectItemProps>(
  ({ project, index, onMouseEnter, onMouseLeave, isActive, isIdle }, ref) => {
    const textRefs = {
      artist: useRef<HTMLSpanElement>(null),
      album: useRef<HTMLSpanElement>(null),
      category: useRef<HTMLSpanElement>(null),
      label: useRef<HTMLSpanElement>(null),
      year: useRef<HTMLSpanElement>(null),
    };

    useEffect(() => {
      if (isActive) {
        // Animate text scramble on hover
        Object.entries(textRefs).forEach(([key, refElement]) => {
          if (refElement.current) {
            gsap.killTweensOf(refElement.current);
            gsap.to(refElement.current, {
              duration: 0.8,
              scrambleText: {
                text: project[key as keyof Project] as string,
                chars: "qwerty1337h@ck3r",
                revealDelay: 0.3,
                speed: 0.4
              }
            });
          }
        });
      } else {
        // Reset text
        Object.entries(textRefs).forEach(([key, refElement]) => {
          if (refElement.current) {
            gsap.killTweensOf(refElement.current);
            refElement.current.textContent = project[key as keyof Project] as string;
          }
        });
      }
    }, [isActive, project]);

    return (
      <li 
        ref={ref}
        className={`project-item ${isActive ? 'active' : ''} ${isIdle ? 'idle' : ''}`}
        onMouseEnter={() => onMouseEnter(index, project.image)}
        onMouseLeave={onMouseLeave}
        data-image={project.image}
      >
        <span ref={textRefs.artist} className="project-data artist hover-text">
          {project.artist}
        </span>
        <span ref={textRefs.album} className="project-data album hover-text">
          {project.album}
        </span>
        <span ref={textRefs.category} className="project-data category hover-text">
          {project.category}
        </span>
        <span ref={textRefs.label} className="project-data label hover-text">
          {project.label}
        </span>
        <span ref={textRefs.year} className="project-data year hover-text">
          {project.year}
        </span>
      </li>
    );
  }
);

ProjectItem.displayName = 'ProjectItem';

// Main Portfolio Component
const MusicPortfolio: React.FC<MusicPortfolioProps> = ({
  PROJECTS_DATA = [], 
  LOCATION = {}, 
  CALLBACKS: _CALLBACKS = {}, 
  CONFIG = {}, 
  SOCIAL_LINKS = {}
}) => {
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isIdle, setIsIdle] = useState(true);
  
  const backgroundRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLElement>(null);
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const idleAnimationRef = useRef<gsap.core.Timeline | null>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const projectItemsRef = useRef<(HTMLLIElement | null)[]>([]);

  // Preload images
  useEffect(() => {
    PROJECTS_DATA.forEach(project => {
      if (project.image) {
        const img = new Image();
        img.src = project.image;
      }
    });
  }, [PROJECTS_DATA]);

  // Start idle animation
  const startIdleAnimation = useCallback(() => {
    if (idleAnimationRef.current) return;
    
    const timeline = gsap.timeline({
      repeat: -1,
      repeatDelay: 2
    });
    
    projectItemsRef.current.forEach((item, index) => {
      if (!item) return;
      
      const hideTime = 0 + index * 0.05;
      const showTime = 0 + (PROJECTS_DATA.length * 0.05 * 0.5) + index * 0.05;
      
      timeline.to(item, {
        opacity: 0.05,
        duration: 0.1,
        ease: "power2.inOut"
      }, hideTime);
      
      timeline.to(item, {
        opacity: 1,
        duration: 0.1,
        ease: "power2.inOut"
      }, showTime);
    });
    
    idleAnimationRef.current = timeline;
  }, [PROJECTS_DATA.length]);

  // Stop idle animation
  const stopIdleAnimation = useCallback(() => {
    if (idleAnimationRef.current) {
      idleAnimationRef.current.kill();
      idleAnimationRef.current = null;
      
      projectItemsRef.current.forEach(item => {
        if (item) {
          gsap.set(item, { opacity: 1 });
        }
      });
    }
  }, []);

  // Start idle timer
  const startIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
    }
    
    idleTimerRef.current = setTimeout(() => {
      if (activeIndex === -1) {
        setIsIdle(true);
        startIdleAnimation();
      }
    }, CONFIG.idleDelay || 4000);
  }, [activeIndex, startIdleAnimation, CONFIG.idleDelay]);

  // Stop idle timer
  const stopIdleTimer = useCallback(() => {
    if (idleTimerRef.current) {
      clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  // Handle mouse enter on project
  const handleProjectMouseEnter = useCallback((index: number, imageUrl?: string) => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    stopIdleAnimation();
    stopIdleTimer();
    setIsIdle(false);
    
    if (activeIndex === index) return;
    
    setActiveIndex(index);
    
    if (imageUrl && backgroundRef.current) {
      // Show background with animation
      const bg = backgroundRef.current;
      bg.style.transition = "none";
      bg.style.transform = "translate(-50%, -50%) scale(1.2)";
      bg.style.backgroundImage = `url(${imageUrl})`;
      bg.style.opacity = "1";
      
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          bg.style.transition = "opacity 0.6s ease, transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)";
          bg.style.transform = "translate(-50%, -50%) scale(1.0)";
        });
      });
    }
  }, [activeIndex, stopIdleAnimation, stopIdleTimer]);

  // Handle mouse leave on project
  const handleProjectMouseLeave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      // Text reset handled in ProjectItem component
    }, 50);
  }, []);

  // Handle container mouse leave
  const handleContainerMouseLeave = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    setActiveIndex(-1);
    
    if (backgroundRef.current) {
      backgroundRef.current.style.opacity = "0";
    }
    
    startIdleTimer();
  }, [startIdleTimer]);

  // Initial idle animation
  useEffect(() => {
    startIdleTimer();
    return () => {
      stopIdleTimer();
      stopIdleAnimation();
    };
  }, [startIdleTimer, stopIdleTimer, stopIdleAnimation]);

  return (
    <>
      <div className="container">
        <main 
          ref={containerRef}
          className={`portfolio-container ${activeIndex !== -1 ? 'has-active' : ''}`}
          onMouseLeave={handleContainerMouseLeave}
        >
          <h1 className="sr-only">Music Portfolio</h1>
          <ul className="project-list" role="list">
            {PROJECTS_DATA.map((project, index) => (
              <ProjectItem
                key={project.id}
                project={project}
                index={index}
                onMouseEnter={handleProjectMouseEnter}
                onMouseLeave={handleProjectMouseLeave}
                isActive={activeIndex === index}
                isIdle={isIdle}
                ref={el => {
                  projectItemsRef.current[index] = el;
                }}
              />
            ))}
          </ul>
        </main>

        <div 
          ref={backgroundRef}
          className="background-image" 
          id="backgroundImage" 
          role="img" 
          aria-hidden="true"
        />

        <aside className="corner-elements">
          <div className="corner-item top-left">
            <div className="corner-square" aria-hidden="true"></div>
          </div>
          <nav className="corner-item top-right">
            <a href={SOCIAL_LINKS.spotify || "https://open.spotify.com/user/226ilulo57zutgtiwjsjqnqsy?si=0004e7bc669a406e"}>
              Spotify
            </a> |
            <a href={SOCIAL_LINKS.email || "mailto:hi@filip.fyi"}>Email</a> |
            <a href={SOCIAL_LINKS.x || "https://x.com/filipz"} target="_blank" rel="noopener">X</a>
          </nav>
          <div className="corner-item bottom-left">
            {LOCATION.display ? `${LOCATION.latitude || '43.9250° N'}, ${LOCATION.longitude || '19.5530° E'}` : '43.9250° N, 19.5530° E'}
          </div>
          <TimeDisplay CONFIG={CONFIG} />
        </aside>
      </div>
    </>
  );
};

export default MusicPortfolio;