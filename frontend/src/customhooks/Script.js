import React, { useEffect } from "react";

export const useScript = (src) => {
  useEffect(() => {
    const tag = document.createElement("script");
    tag.async = true;
    tag.src = src;
    document.body.appendChild(tag);

    return () => {
      document.body.removeChild(tag);
    };
  }, [src]);
};