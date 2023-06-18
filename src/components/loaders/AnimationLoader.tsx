import Image from "next/image";
import type { FC } from "react";

const AnimationLoader: FC = () => {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="flex flex-col items-center">
        <Image
          src="images/logo_opaque.svg"
          alt="Logo"
          className="animate-spin-slow rounded-full"
          width={600}
          height={600}
        />
      </div>
    </div>
  );
};

export default AnimationLoader;
