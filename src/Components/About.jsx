// import React from 'react';
// import { motion } from 'framer-motion';
// import { SparklesIcon } from '@heroicons/react/24/outline';
// import Header from './navbar';

// export default function About() {
//   return (
//     <>
//     <Header/>
//     <div className="bg-gradient-to-br from-white via-gray-100 to-blue-50 min-h-screen">
//       {/* Hero Section */}
//       <motion.div
//         className="max-w-7xl mx-auto text-center py-20 px-6"
//         initial={{ opacity: 0, y: -50 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 1 }}
//       >
//         <h1 className="text-5xl font-extrabold text-gray-900 mb-4">About <span className="text-blue-600">CAP</span></h1>
//         <p className="text-lg text-gray-600 max-w-3xl mx-auto">
//           Building the future with purpose, innovation, and heart.
//         </p>
//       </motion.div>

 
//       <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-20">
//         {[
//           {
//             title: 'Our Mission',
//             desc: 'To empower communities and individuals through cutting-edge technology, transparency, and empathy.',
//           },
//           {
//             title: 'Our Vision',
//             desc: 'To be the driving force behind impactful digital transformations that change lives for the better.',
//           },
//           {
//             title: 'Our Values',
//             desc: 'Integrity, Collaboration, Excellence, and Compassion are at the core of everything we do.',
//           },
//         ].map((item, index) => (
//           <motion.div
//             key={index}
//             className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition"
//             initial={{ opacity: 0, y: 40 }}
//             whileInView={{ opacity: 1, y: 0 }}
//             viewport={{ once: true }}
//             transition={{ duration: 0.8, delay: index * 0.2 }}
//           >
//             <SparklesIcon className="w-8 h-8 text-blue-500 mb-4" />
//             <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
//             <p className="text-gray-600">{item.desc}</p>
//           </motion.div>
//         ))}
//       </div>


//       <motion.div
//         className="bg-white py-16 px-6 mt-10 shadow-inner"
//         initial={{ opacity: 0 }}
//         whileInView={{ opacity: 1 }}
//         viewport={{ once: true }}
//         transition={{ duration: 1 }}
//       >
//         <div className="max-w-4xl mx-auto text-center">
//           <h2 className="text-3xl font-bold mb-4">Why Choose CAP?</h2>
//           <p className="text-gray-700 text-lg leading-relaxed">
//             At CAP, we don't just build products — we craft experiences that matter. Our commitment to user-first design, robust functionality, and meaningful impact makes us a standout choice for clients and communities alike.
//           </p>
//         </div>
//       </motion.div>
//     </div>
//     </>
//   );
// }



import React from 'react';
import { motion } from 'framer-motion';
import { SparklesIcon } from '@heroicons/react/24/outline';
import Header from './navbar';

export default function About() {
  return (
    <>
      <Header />
      <div className="bg-gradient-to-br from-white via-gray-100 to-blue-50 min-h-screen">

        {/* Hero Section */}
        <motion.div
          className="max-w-7xl mx-auto text-center py-20 px-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl font-extrabold text-gray-900 mb-4">
            About <span className="text-blue-600">CAP</span>
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Crafting headwear that speaks style, comfort, and quality.
          </p>
        </motion.div>

        {/* Cards Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6 pb-20">
          {[
            {
              title: 'Innovative Design',
              desc: 'Every cap is designed with precision, from modern street styles to classic curves — blending fashion and function.',
            },
            {
              title: 'Premium Craftsmanship',
              desc: 'Made using high-grade, breathable materials to ensure durability, comfort, and perfect fit — for every head, every day.',
            },
            {
              title: 'Customer First',
              desc: 'We offer easy returns, responsive support, and a satisfaction guarantee because our customers deserve nothing less.',
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              className="bg-white shadow-xl rounded-2xl p-6 hover:shadow-2xl transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <SparklesIcon className="w-8 h-8 text-blue-500 mb-4" />
              <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600">{item.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Why Choose Us Section */}
        <motion.div
          className="bg-white py-16 px-6 mt-10 shadow-inner"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
        >
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Why Choose CAP?</h2>
            <p className="text-gray-700 text-lg leading-relaxed">
              Whether you're shielding from the sun or styling your look, CAP delivers the perfect combination of design, comfort, and reliability.
              We’re not just selling headwear — we’re shaping statements. With an ever-growing range, quick delivery, and customer-friendly policies,
              your perfect cap is just a click away.
            </p>
          </div>
        </motion.div>
      </div>
    </>
  );
}
