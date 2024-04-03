import React, { useEffect } from "react";
import { useUserFaces } from "@/hooks/useUserFaces";
import { useFaceStore } from "@/stores/faces.store";
import { useRouter } from "next/navigation";
type GestureHandlerProps = {
    children: React.ReactNode;
};

const GestureHandler = (props: GestureHandlerProps) => {
    useUserFaces();
    const isNewUser = useFaceStore((state) => state.isNewUser);
    const router = useRouter();

    useEffect(() => {
        if (isNewUser) {
            router.push("/camera");
        } else {
            router.push("/");
        }
    }, [isNewUser]);

    return <>{props.children}</>;
};

export default GestureHandler;
