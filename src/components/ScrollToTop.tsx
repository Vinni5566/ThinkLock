import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop component ensures that the page scroll position is reset 
 * on route changes and correctly handles smooth scrolling for hash anchors.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    // If there is no hash, scroll to the very top of the page
    if (!hash) {
      window.scrollTo(0, 0);
    } 
    // If there is a hash, attempt to find the element and scroll to it
    else {
      const id = hash.replace("#", "");
      // Small timeout to allow the DOM to render if navigating from another page
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 0);
    }
  }, [pathname, hash]);

  return null;
};
