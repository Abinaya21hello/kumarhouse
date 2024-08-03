import React, { useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import "./Style.css";

const ImageLoader = ({ src, alt }) => {
  const [loading, setLoading] = useState(true);

  const handleImageLoaded = () => {
    setLoading(false);
  };

  return (
    <div className="gradient-background">
      <div className="image-loader-container">
        <div className={`image-wrapper ${loading ? "loading" : ""}`}>
          <div className="Load_image">
            <div className="p-3">
              <img
                src={src}
                alt={alt}
                onLoad={handleImageLoaded}
                className="image"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};


export default ImageLoader;
