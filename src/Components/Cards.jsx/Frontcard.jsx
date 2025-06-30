import { useState } from "react";
export default function ProductCard() {
  const [isHovered, setIsHovered] = useState(false);
  // Product images
  const image1 = "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/81d337231962493abc1755d38d4b25d9_9366/Cap_White_JC6049_01_00_standard.jpg"; // Default image
  const image2 = "https://assets.adidas.com/images/h_2000,f_auto,q_auto,fl_lossy,c_fill,g_auto/eeee9d533f1a424c93fc19c879f666da_9366/Cap_White_JC6049_41_detail_hover_hover_hover.jpg"; // Hover image
  return (
    <div className="max-w-lg mx-auto p-4">
      <div className=" p-4 rounded-lg flex items-center shadow-xl 
      " style={{boxShadow:'5px 5px 50px black'}}>
        {/* Left: Image section */}
        <div
          className="w-1/2 relative"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <span className="absolute top-2 left-2 bg-yellow-400 text-xs font-bold px-2 py-1 rounded">
            SALE
          </span>
          <img
            src={isHovered ? image2 : image1}
            alt="Product"
            className="rounded-md transition-all duration-300 w-150 h-60"
          />
        </div>
        {/* Right: Product Info */}
        <div className="w-1/2 pl-4 " style={{ textShadow: "2px 2px 2px rgba(255, 0, 0, 0.5)" }}>
          <h3 className="text-lg text-[#F9FAFB] font-bold" >MARATHON MASTER</h3>
          <p className="  text-[#F9FAFB] text-lg font-semibold">
            $140.00{" "}
            <span className="text-gray-400 line-through text-sm">$160.00</span>
          </p>
          <button className="mt-3 px-4 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition">
            ADD TO CART
          </button>
        </div>
      </div>
    </div>
  );
}