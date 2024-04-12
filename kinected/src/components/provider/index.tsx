import React from "react";
import GestureHandler from "./gesture";
import FaceHandler from "./face";
import SensorsHandler from "./sensors";
import { TeethTimerStoreProvider } from "@/components/provider/timer";

type Props = {
  children: React.ReactNode;
};

export default function Provider(props: Props) {
  return (
    <TeethTimerStoreProvider>
      <SensorsHandler>
        <GestureHandler>
          <FaceHandler>{props.children}</FaceHandler>
        </GestureHandler>
      </SensorsHandler>
    </TeethTimerStoreProvider>
  );
}
