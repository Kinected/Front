import React, { useEffect } from "react";
import { useUserFaces } from "@/hooks/useUserFaces";
import { useFaceStore } from "@/stores/faces.store";
import { useRouter } from "next/navigation";

type FaceHandlerProps = {
    children: React.ReactNode;
};

const FaceHandler = (props: FaceHandlerProps) => {
    useUserFaces();
    const isNewUser = useFaceStore((state) => state.isNewUser);
    const router = useRouter();

    useEffect(() => {
        if (isNewUser) {
            router.push("/camera");
        }
    }, [isNewUser]);

    return <>{props.children}</>;
};

export default FaceHandler;
