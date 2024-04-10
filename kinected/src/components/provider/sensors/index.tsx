import React from "react";
import { useSensors } from "@/hooks/useSensors";

type SensorsHandlerProps = {
    children: React.ReactNode;
};

const SensorsHandler = (props: SensorsHandlerProps) => {
    useSensors();

    return <>{props.children}</>;
};

export default SensorsHandler;
