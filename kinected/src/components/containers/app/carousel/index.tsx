// "use client";

// import React from "react";

// export type CSSCarouselProps = {
//   className?: string;
//   startSpace?: string | number;
//   endSpace?: string | number;
//   gap?: string | number;
//   padding?: string | number;
//   disableSnap?: boolean;
// } & React.DetailedHTMLProps<
//   React.HTMLAttributes<HTMLDivElement>,
//   HTMLDivElement
// >;

// interface CarouselCardProps {
//   id?: string;
//   title?: string;
//   description?: string;
//   image?: string;
// }

// const CarouselCards: React.FC<CarouselCardProps> = ({
//   id,
//   title,
//   description,
//   image,
// }) => {
//   return (
//     <div className="flex flex-col items-center bg-white">
//       {/* <img src={image} alt={title} /> */}
//       <h3>{title}</h3>
//       <p>{description}</p>
//     </div>
//   );
// };

// export default function CarouselCard(props: CSSCarouselProps) {
//   return (
//     <div className={props.className} style={{ padding: props.padding }}>
//       <CarouselCards id="1" title="Spotify" description="Description 1" />
//       <CarouselCards id="2" title="Mauria" description="Description 2" />
//       <CarouselCards id="3" title="Météo" description="Description 3" />
//     </div>
//   );
// }

"use client";

import React, { useRef, useState } from "react";
import { useSpring, animated } from "react-spring";
import Link from "next/link";
import Button from "@/components/button";
import CarouselItemApp from "./item";
import { useUserActionsStore } from "@/stores/gestures.store";
import Mauria from "@/icons/mauria.svg";
import Spotify from "@/icons/spotify.svg";
import Sun from "@/icons/sun.svg";

const carouselProducts = [
  {
    id: 1,
    name: "Spotify",
    // image: Spotify,
    link: "https://demo.vercel.store/product/acme-geometric-circles-tshirt",
  },
  {
    id: 2,
    name: "Mauria",
    // image: Mauria,
    link: "https://demo.vercel.store/product/acme-drawstring-bag",
  },
  {
    id: 3,
    name: "Météo",
    // image: Sun,
    link: "https://demo.vercel.store/product/acme-cup",
  },
];

export default function Carousel() {
  const [beforeID, setBeforeID] = useState(
    carouselProducts[carouselProducts.length - 1].name
  );
  const [currentID, setCurrentID] = useState(carouselProducts[0].name);
  const [nextID, setNextID] = useState(carouselProducts[1].name);

  const handleNextButtonClick = () => {
    const firstProduct = carouselProducts.shift();
    if (firstProduct) {
      carouselProducts.push(firstProduct);
      setCurrentID(carouselProducts[0].name);
      setNextID(carouselProducts[1]?.name || "");
      setBeforeID(carouselProducts[carouselProducts.length - 1].name);
    }
  };

  const handlePreviousButtonClick = () => {
    const lastProduct = carouselProducts.pop();
    if (lastProduct) {
      carouselProducts.unshift(lastProduct);
      setCurrentID(carouselProducts[0].name);
      setNextID(carouselProducts[1]?.name || "");
      setBeforeID(carouselProducts[carouselProducts.length - 1].name);
    }
  };
  console.log("currentId", currentID);

  const currentSwipe = useUserActionsStore((state) => state.current_action);

  return (
    <div className="relative grid grid-cols-6 gap-24 items-center justify-center">
      <CarouselItemApp
        position="left"
        isHover={currentSwipe === "hover_right"}
        content={beforeID}
        // onClick={() => playPreviousSong(props.token)}
        onClick={handlePreviousButtonClick}
      >
        {/* flex col + image + txt */}
      </CarouselItemApp>
      <CarouselItemApp position="center" content={currentID} />
      <CarouselItemApp
        position="right"
        isHover={currentSwipe === "hover_left"}
        content={nextID}
        // onClick={() => playNextSong(props.token)}
        onClick={handleNextButtonClick}
      />
    </div>
  );
}
