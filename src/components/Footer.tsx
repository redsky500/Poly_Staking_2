import { useEffect, useState } from "react";

import * as Gricon from "react-icons/gr";
export default function Footer() {
  const [clickScrollTopBtnState, setClickScrollTopBtnState] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const scrollToTop = () => {
    setClickScrollTopBtnState(true);
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.pageYOffset > 400) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
        setClickScrollTopBtnState(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);

    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  return (
    <footer className="w-full text-center px-4 sm:px-16 pb-6 font-inter gap-8 xl:mt-10">
      <div className="max-w-[1400px] flex m-auto justify-between items-center">
        {isVisible && (
          <div
            className="fixed bottom-10 right-3 sm:right-5 p-3 bg-black border-[1px] border-white border-dashed cursor-pointer animate-bounce"
            onClick={() => scrollToTop()}
          >
            <Gricon.GrArchlinux color="white" />
          </div>
        )}
        <span className="text-white text-[0.8rem]">
          Copyright 2023. POLY STAKING APP.
        </span>
      </div>
    </footer>
  );
}
