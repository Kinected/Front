import React from "react";
import SwipeButton from "@/components/Layout/Buttons/SwipeButton";

type YeeProps = {
  className?: string;
};

const Yee = (props: YeeProps) => {
  return (
    <SwipeButton position={"up"}>
      Hello
    </SwipeButton>
  );
};

export default Yee;
