

import { motion } from "framer-motion";
import ProductCard from "./Cards.jsx/Frontcard";
import Header from "./navbar";
import Productlist from "./Productlist";
import Footer from "./Footer";
import { useNavigate } from "react-router-dom";


function Homepage() {

const navigate=useNavigate()
  const img =
    "https://5.imimg.com/data5/SELLER/Default/2023/7/322508173/UO/PT/UB/139692930/men-stylish-caps.jpg";



    
  return (
    <>
    <Header/>
      <div
        className="h-screen flex items-center justify-center"
        style={{
          backgroundImage: `url(${img})`,
          backgroundSize: "cover",
          backgroundColor: "black",
        }}
      ></div>

    
      <motion.h1
        initial={{ x: "10vw",opacity: 0 }}
        animate={{ x: 0 ,opacity: 1}}
        transition={{ type: "tween", ease: "easeOut", duration: 2}}
        className="text-4xl font-bold absolute left-10 top-15 font-bold text-[60px]"
      >
       
       <span style={{ fontSize: "120px" }}>
            E<span style={{ color: "yellowgreen" }}>x</span>ploring the world
          </span>{" "}
          <br /> one c<span style={{ color: "red" }}>A</span>p at a time.

         
      </motion.h1>
      <motion.button
        initial={{ y: "10vh",opacity: 0 }}
        animate={{ y: 0 ,opacity: 1}}
        transition={{ type: "tween", ease: "easeOut", duration: 2 }}
        className="absolute bottom-80 left-20
                 mt-3 px-4 py-2 border border-black rounded-full text-sm font-medium hover:bg-black hover:text-white transition"
                 onClick={()=>navigate("/all-products")}
      >
      <span
        
      >
        SHOP NOW
      </span>
      </motion.button>


      

      <div className="absolute bottom-0 right-20">
        <ProductCard />
      </div>
      <Productlist/>
     <Footer/>
    </>
  );
}

export default Homepage;
