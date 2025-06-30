

import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-700 text-white px-4 py-10">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
 
        <div>
          <h3 className="text-lg font-semibold mb-2">Contact</h3>
          <p className="mb-1">info@mysite.com</p>
          <p className="mb-1">123-456-7890</p>
          <p>500 Terry Francine St. SA, CA 9415</p>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Legal</h3>
          <ul className="space-y-1">
            <li>Terms & Conditions</li>
            <li>Privacy Policy</li>
            <li>Shipping & Refunds</li>
          </ul>
        </div>

        <div>
          <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
          <div className="flex space-x-3">
          <a href="https://www.instagram.com/" className="hover:text-blue-300" target="_blank" rel="noopener noreferrer">
  Instagram
</a>

            <a href="#" className="hover:text-blue-300">Facebook</a>
            <a href="#" className="hover:text-blue-300">TikTok</a>
          </div>
        </div>
      </div>

      <div className="mt-8 text-center text-xs text-gray-300">
        © 2025 CAP
     
      </div>
    </footer>
  );
};

export default Footer;
