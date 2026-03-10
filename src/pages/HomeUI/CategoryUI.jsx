import React, { useState, useEffect } from 'react'
import CategoryCards from "../../components/CategoryCards"

export default function CategoryUI() {
  const [textColor, setTextColor] = useState('#505039');

  useEffect(() => {
    // Function to get current primary color from CSS variables
    const updateColor = () => {
      const color = getComputedStyle(document.documentElement).getPropertyValue('--primary').trim();
      if (color) {
        setTextColor(color);
      }
    };

    // Initial check
    // Use a small timeout to let the Navbar set the initial style if needed
    const timer = setTimeout(updateColor, 50);

    // Observe changes to style attribute on html tag where Navbar applies the themes
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'style') {
          updateColor();
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['style'] });

    return () => {
      clearTimeout(timer);
      observer.disconnect();
    };
  }, []);

  return (
    <div style={{ height: '500px', position: 'relative' }} className="py-10">
        <h1 className="text-3xl md:text-5xl font-black text-center text-[var(--text)] tracking-tight uppercase">
            Our Product Categories
        </h1>
        <hr className="w-24 h-1.5 mx-auto my-6 bg-[var(--primary)] border-0 rounded-full" />
      <CategoryCards 
        bend={0} 
        textColor={textColor} 
        borderRadius={0.05} 
        scrollSpeed={2.2}
        scrollEase={0.05}
      />
    </div>
  )
}
