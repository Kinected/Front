"use client";

import Carousel from "@/components/containers/app/carousel";
import Button from "@/components/button";

export default function AppPage() {
  return (
    <div className="flex flex-col h-1/2 items-center ">
      <div className="flex  ">
        <Carousel />
      </div>
      {/* <Button onClick={handleButtonClick}>Click me</Button> */}
    </div>
  );
}
