"use client";

import React, { useEffect, useRef, useState } from "react";
import CarouselItemApp from "./item";
import { useUserActionsStore } from "@/stores/gestures.store";
import Mauria from "@/icons/mauria.svg";
import Spotify from "@/icons/spotify.svg";
import Sun from "@/icons/sun.svg";
import Ilevia from "@/icons/ilevia.svg";
import OpenAI from "@/icons/openai.svg";
import ToothBrush from "@/icons/ToothBrush.svg";

const initialProducts = [
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
  {
    id: 4,
    name: "Chatvoc",
    image: OpenAI,
    link: "/audio/chat-voc",
  },
  {
    id: 5,
    name: "Ilévia",
    image: Ilevia,
    link: "/ilevia",
  },
  {
    id: 6,
    name: "Teeth Timer",
    image: ToothBrush,
    link: "/teeth-timer",
  },
];

export default function Carousel() {
  const [carouselProducts, setCarouselProducts] = useState(initialProducts);

  const [beforeProduct, setBeforeProduct] = useState(
    carouselProducts[carouselProducts.length - 1]
  );
  const [currentProduct, setCurrentProduct] = useState(carouselProducts[0]);
  const [nextProduct, setNextProduct] = useState(carouselProducts[1]);

  const handleNextButtonClick = () => {
    const newCarouselProducts = [...carouselProducts];
    const firstProduct = newCarouselProducts.shift();
    if (firstProduct) {
      newCarouselProducts.push(firstProduct);
      setCarouselProducts(newCarouselProducts);
      setCurrentProduct(newCarouselProducts[0]);
      setNextProduct(newCarouselProducts[1]);
      setBeforeProduct(newCarouselProducts[newCarouselProducts.length - 1]);
    }
  };

  const handlePreviousButtonClick = () => {
    const newCarouselProducts = [...carouselProducts];
    const lastProduct = newCarouselProducts.pop();
    if (lastProduct) {
      newCarouselProducts.unshift(lastProduct);
      setCarouselProducts(newCarouselProducts);
      setCurrentProduct(newCarouselProducts[0]);
      setNextProduct(newCarouselProducts[1]);
      setBeforeProduct(newCarouselProducts[newCarouselProducts.length - 1]);
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
    <div className="relative grid grid-cols-6 h-1/2 text-white items-center justify-center">
      <CarouselItemApp
        position="left"
        isHover={currentSwipe === "hover_right"}
        onClick={handlePreviousButtonClick}
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
        onClick={handleNextButtonClick}
      >
        <nextProduct.image className="size-30 text-white" />
        <p>{nextProduct.name}</p>
      </CarouselItemApp>
    </div>
  );
}
