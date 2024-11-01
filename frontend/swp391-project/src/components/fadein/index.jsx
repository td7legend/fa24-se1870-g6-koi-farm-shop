import React from "react";

const FadeInSection = React.forwardRef(({ children, isVisible }, ref) => {
  return (
    <div ref={ref} className={`fade-in-section ${isVisible ? "visible" : ""}`}>
      {children}
    </div>
  );
});

export default FadeInSection;
