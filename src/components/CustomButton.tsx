/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable @next/next/no-img-element */
import Loader from "react-spinners/HashLoader";

const loader = (
  <div className="flex items-center justify-center w-full">
    <Loader size={"30"} color={"white"} />
  </div>
);

const CustomButton = ({ handleClickEvent, isProcessing, text }: any) => {
  return (
    <button
      className="disabled:cursor-default disabled:opacity-75 disabled:hover:bg-gray-800 bg-gray-800 hover:bg-themeColorRight text-white font-hairline py-2 px-4 rounded w-full cursor-pointer"
      onClick={() => handleClickEvent()}
      disabled={isProcessing}
    >
      {isProcessing ? loader : text}
    </button>
  );
};

export default CustomButton;
