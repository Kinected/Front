"use client";

import React, { useEffect, useRef, useState } from "react";
import CarouselItemApp from "./item";
import { useUserActionsStore } from "@/stores/gestures.store";
import Mauria from "@/icons/mauria.svg";
import Spotify from "@/icons/spotify.svg";
import Sun from "@/icons/sun.svg";

const carouselProducts = [
  {
    id: 1,
    name: "Spotify",
    image: Spotify,
    link: "/spotify",
  },
  {
    id: 2,
    name: "Mauria",
    image: Mauria,
    link: "/mauria",
  },
  {
    id: 3,
    name: "Météo",
    image: Sun,
    link: "/weather",
  },
];

export default function Carousel() {
  const [beforeProduct, setBeforeProduct] = useState(
    carouselProducts[carouselProducts.length - 1]
  );
  const [currentProduct, setCurrentProduct] = useState(carouselProducts[0]);
  const [nextProduct, setNextProduct] = useState(carouselProducts[1]);

  const handleNextButtonClick = () => {
    const firstProduct = carouselProducts.shift();
    if (firstProduct) {
      carouselProducts.push(firstProduct);
      setCurrentProduct(carouselProducts[0]);
      setNextProduct(carouselProducts[1]);
      setBeforeProduct(carouselProducts[carouselProducts.length - 1]);
    }
  };

  const handlePreviousButtonClick = () => {
    const lastProduct = carouselProducts.pop();
    if (lastProduct) {
      carouselProducts.unshift(lastProduct);
      setCurrentProduct(carouselProducts[0]);
      setNextProduct(carouselProducts[1]);
      setBeforeProduct(carouselProducts[carouselProducts.length - 1]);
    }
  };

  const currentSwipe = useUserActionsStore((state) => state.current_action);
  const updateEffectsOnAction = useUserActionsStore(
    (state) => state.updateEffectsOnAction
  );

  useEffect(() => {
    updateEffectsOnAction({
      left: handleNextButtonClick,
      right: handlePreviousButtonClick,
      click: () => window.open(currentProduct.link),
    });
  }, []);

  return (
    <div className="relative grid grid-cols-6 text-white items-center justify-center">
      <CarouselItemApp
        position="left"
        isHover={currentSwipe === "hover_right"}
        onClick={handleNextButtonClick}
      >
        <div className="flex flex-col items-center">
          <beforeProduct.image className="size-30 text-white" />
          <p>{beforeProduct.name}</p>
        </div>
      </CarouselItemApp>
      <CarouselItemApp position="center">
        <currentProduct.image className="size-40 text-white" />
        <p>{currentProduct.name}</p>
      </CarouselItemApp>
      <CarouselItemApp
        position="right"
        isHover={currentSwipe === "hover_left"}
        onClick={handlePreviousButtonClick}
      >
        <nextProduct.image className="size-30 text-white" />
        <p>{nextProduct.name}</p>
      </CarouselItemApp>
    </div>
  );
}
