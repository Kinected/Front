import React from "react";
import { useFaceStore } from "@/stores/faces.store";
import { useSensors } from "@/hooks/useSensors";

type SensorsHandlerProps = {
    children: React.ReactNode;
};

const SensorsHandler = (props: SensorsHandlerProps) => {
    useSensors();

    return <>{props.children}</>;
};

export default SensorsHandler;
