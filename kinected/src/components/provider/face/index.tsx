import React, { useEffect } from "react";
import { useUserFaces } from "@/hooks/useUserFaces";
import { useFaceStore } from "@/stores/faces.store";
import { usePathname, useRouter } from "next/navigation";

type FaceHandlerProps = {
  children: React.ReactNode;
};

const FaceHandler = (props: FaceHandlerProps) => {
  useUserFaces();
  const isNewUser = useFaceStore((state) => state.isNewUser);
  const router = useRouter();
  const path = usePathname();

  useEffect(() => {
    if (isNewUser == null) return;
    else if (isNewUser) {
      router.push("/camera");
    } else if (path == "/camera") {
      router.push("/");
    }
  }, [isNewUser]);

  return <>{props.children}</>;
};

export default FaceHandler;
