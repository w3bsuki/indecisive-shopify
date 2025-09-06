'use client'

import MusicPortfolio from "@/components/ui/music-portfolio";

export default function Demo() {
  const projectsData = [
    {
      id: 1,
      artist: "INDECISIVE WEAR",
      album: "ХУЛИГАНКА",
      category: "BUCKET HATS",
      label: "SELF RELEASED",
      year: "2024",
      image: "/indecisive-stars/hooligan.jpg"
    },
    {
      id: 2,
      artist: "INDECISIVE WEAR",
      album: "DADDY ISSUES",
      category: "T-SHIRTS",
      label: "SELF RELEASED",
      year: "2024",
      image: "/indecisive-stars/emotionally unavailable star.jpg"
    },
    {
      id: 3,
      artist: "INDECISIVE WEAR",
      album: "CROP TOPS",
      category: "TOPS",
      label: "SELF RELEASED",
      year: "2024",
      image: "https://i.pinimg.com/736x/90/cf/ec/90cfec4c5230978dba450909c676fd42.jpg"
    },
    {
      id: 4,
      artist: "INDECISIVE WEAR",
      album: "TOTE BAGS",
      category: "BAGS",
      label: "SELF RELEASED",
      year: "2024",
      image: "https://i.pinimg.com/736x/8a/9d/06/8a9d06bccabc53834aa311fb3beb75f6.jpg"
    },
    {
      id: 5,
      artist: "INDECISIVE WEAR",
      album: "HOODIES",
      category: "HOODIES",
      label: "COMING SOON",
      year: "2025",
      image: "https://i.pinimg.com/1200x/99/0d/93/990d93d257f1f31ac12fbd161b29da8b.jpg"
    },
    {
      id: 6,
      artist: "INDECISIVE WEAR",
      album: "ACCESSORIES",
      category: "MISC",
      label: "LIMITED",
      year: "2024",
      image: "https://i.pinimg.com/1200x/1c/17/6b/1c176b16985212a93a950d61793b7e18.jpg"
    }
  ];

  const config = {
    timeZone: "Europe/Sofia",
    timeUpdateInterval: 1000,
    idleDelay: 4000,
    debounceDelay: 100
  };

  const socialLinks = {
    spotify: "https://open.spotify.com/playlist/indecisivewear",
    email: "mailto:hello@indecisivewear.com",
    x: "https://x.com/indecisive_wear"
  };

  const location = {
    latitude: "42.6977° N",
    longitude: "23.3219° E",
    display: true
  };

  const callbacks = {
    onProjectHover: (project: any) => console.log('Hovering:', project),
    onProjectLeave: () => console.log('Left project'),
    onContainerLeave: () => console.log('Left container'),
    onIdleStart: () => console.log('Idle animation started'),
    onThemeChange: (theme: string) => console.log(`Theme changed to: ${theme}`)
  };

  return (
    <MusicPortfolio
      PROJECTS_DATA={projectsData}
      CONFIG={config}
      SOCIAL_LINKS={socialLinks}
      LOCATION={location}
      CALLBACKS={callbacks}
    />
  );
}