import { useRef, useState } from "react";
import Draggable from "react-draggable";
import "./TshirtlogoDesign.css";

const TshirtLogoDesigner = () => {
  const [logo, setLogo] = useState(null);
  const [logoSize, setLogoSize] = useState({ width: 100, height: 100 });
  const [aspectRatio, setAspectRatio] = useState(1);
  const canvasRef = useRef(null);
  const logoRef = useRef(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const img = new Image();
        img.src = reader.result;
        img.onload = () => {
          setAspectRatio(img.width / img.height);
          setLogo(reader.result);
        };
      };
      reader.readAsDataURL(file);
    } else {
      console.error("No file selected!");
    }
  };

  const handleResize = (e) => {
    const size = e.target.value;
    setLogoSize({
      width: size,
      height: size / aspectRatio,
    });
  };

  const handleSave = async () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const loadImage = (image) =>
      new Promise((resolve, reject) => {
        if (image.complete) {
          resolve(image);
        } else {
          image.onload = () => resolve(image);
          image.onerror = reject;
        }
      });

    try {
      const tshirtImage = document.getElementById("tshirtImage");
      const logoImage = document.getElementById("logoImage");

      await Promise.all([loadImage(tshirtImage), loadImage(logoImage)]);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(tshirtImage, 0, 0, canvas.width, canvas.height);
      if (logoImage && logoRef.current) {
        const logoBounds = logoRef.current.getBoundingClientRect();
        const canvasBounds = canvas.getBoundingClientRect();

        const scaleX = canvas.width / canvasBounds.width;
        const scaleY = canvas.height / canvasBounds.height;

        const x = (logoBounds.left - canvasBounds.left) * scaleX;
        const y = (logoBounds.top - canvasBounds.top) * scaleY;

        console.log({ x, y, scaleX, scaleY });

        if (!isNaN(x) && !isNaN(y)) {
          ctx.drawImage(
            logoImage,
            x,
            100,
            logoSize.width * scaleX,
            logoSize.height * scaleY
          );
          console.log("Logo drawn at:", x, y);
        } else {
          console.error("Invalid dynamic position: x or y is NaN.");
        }
      }

      // Save the final image
      const finalImage = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = "final-tshirt.png";
      link.href = finalImage;
      link.click();

      console.log("Final image URL:", finalImage);
    } catch (error) {
      console.error("Error generating the final image:", error);
    }
  };

  return (
    <div className="tshirt-designer">
      <h1 style={{ marginBottom: "1rem" }}>T-Shirt Designer</h1>
      <div className="designer-container">
        {/* T-Shirt Image Container */}
        <div style={{ width: 450, height: 400, position: "relative" }}>
          <img
            id="tshirtImage"
            src="/assets/tshirt.png"
            alt="T-Shirt"
            className="tshirt-image"
            style={{ width: "100%", height: "100%" }}
          />
          {logo && (
            <Draggable nodeRef={logoRef}>
              <div
                id="logo-container"
                ref={logoRef}
                style={{
                  position: "absolute",
                  width: `${logoSize.width}px`,
                  height: `${logoSize.height}px`,
                }}
              >
                <img
                  id="logoImage"
                  src={logo}
                  alt="Logo"
                  style={{
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                  }}
                />
              </div>
            </Draggable>
          )}
        </div>

        {/* Upload and Controls */}
        <div className="controls">
          <input
            type="file"
            accept="image/*"
            onChange={handleLogoUpload}
            className="upload-input"
          />
          <div className="slider-container">
            <label>Resize Logo: {logoSize.width}</label>
            <input
              type="range"
              min="50"
              max="200"
              className="slider"
              value={logoSize.width}
              onChange={handleResize}
            />
          </div>
          <button onClick={handleSave} className="save-button">
            Save T-Shirt
          </button>
        </div>
      </div>

      {/* Canvas for Final Image */}
      <canvas ref={canvasRef} width={450} height={400} />
    </div>
  );
};

export default TshirtLogoDesigner;
