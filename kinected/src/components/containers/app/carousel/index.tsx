"use client";

import React, { useRef, useState } from "react";
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
    link: "https://demo.vercel.store/product/acme-geometric-circles-tshirt",
  },
  {
    id: 2,
    name: "Mauria",
    image: Mauria,
    link: "https://demo.vercel.store/product/acme-drawstring-bag",
  },
  {
    id: 3,
    name: "Météo",
    image: Sun,
    link: "https://demo.vercel.store/product/acme-cup",
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

  return (
    <div className="relative grid grid-cols-6 gap-24 items-center justify-center">
      <CarouselItemApp
        position="left"
        isHover={currentSwipe === "hover_right"}
        onClick={handlePreviousButtonClick}
      >
        <div className="flex flex-col items-center">
          <img src={beforeProduct.image} alt={beforeProduct.name} />
          <p>{beforeProduct.name}</p>
        </div>
      </CarouselItemApp>
      <CarouselItemApp position="center">
        <img src={currentProduct.image} alt={currentProduct.name} />
        <p>{currentProduct.name}</p>
      </CarouselItemApp>
      <CarouselItemApp
        position="right"
        isHover={currentSwipe === "hover_left"}
        onClick={handleNextButtonClick}
      >
        <img src={nextProduct.image} alt={nextProduct.name} />
        <p>{nextProduct.name}</p>
      </CarouselItemApp>
    </div>
  );
}
