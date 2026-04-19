import React from 'react';
import Navbar from './navbar';

const About = () => {
  return (
    <>
      <Navbar />
      <div className="relative bg-[#080C14] min-h-screen">
        {/* Decorative Background */}
        <div className="absolute inset-0 -z-10 h-full w-full bg-[#080C14]">
          <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_800px_at_100%_200px,rgba(14,165,233,0.06),transparent)]"></div>
        </div>

        {/* Main Content */}
        <div className="min-h-screen flex flex-col justify-center items-center py-12 px-4">
          <div className="max-w-5xl w-full p-10 bg-[#0F1927] border border-[rgba(14,165,233,0.1)] rounded-[16px] relative overflow-hidden">
            {/* Floating Decorative Elements */}
            <div className="absolute -top-10 -right-10 w-48 h-48 bg-[#0EA5E9] rounded-full opacity-[0.04]"></div>
            <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-[#0EA5E9] rounded-full opacity-[0.04]"></div>

            {/* About Section */}
            <h1 className="text-3xl font-extrabold text-center text-[#E2E8F0] mb-6">
              About Our Inventory Management System
            </h1>
            <p className="text-lg text-[#94A3B8] leading-relaxed text-center mb-6">
              Our Inventory Management System helps businesses manage their stock, sales, and overall operations efficiently. From tracking product quantities to generating bills, this system enhances workflow, reduces errors, and improves business performance.
            </p>

            {/* Key Features */}
            <h2 className="text-3xl font-semibold text-[#E2E8F0] mt-8 mb-4 text-center">
              Key Features
            </h2>
            <ul className="list-disc list-inside space-y-3 text-[#94A3B8] text-center">
              <li>Real-time product tracking with low-stock and expiration notifications.</li>
              <li>Automated bill generation with product quantity adjustments.</li>
              <li>Personalized user authentication for shop owners.</li>
              <li>Advanced data analytics for sales and inventory trends.</li>
            </ul>

            {/* Technology Stack */}
            <h2 className="text-3xl font-semibold text-[#E2E8F0] mt-10 mb-6 text-center">
              Technology Stack
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
              <div className="bg-[#111C2D] p-6 rounded-[12px] border border-[rgba(14,165,233,0.1)] transition-transform transform hover:scale-105 hover:border-[rgba(14,165,233,0.3)]">
                <h3 className="text-2xl font-semibold text-[#E2E8F0] mb-2">Frontend</h3>
                <p className="text-[#94A3B8]">React with Tailwind CSS</p>
              </div>
              <div className="bg-[#111C2D] p-6 rounded-[12px] border border-[rgba(14,165,233,0.1)] transition-transform transform hover:scale-105 hover:border-[rgba(14,165,233,0.3)]">
                <h3 className="text-2xl font-semibold text-[#E2E8F0] mb-2">Backend</h3>
                <p className="text-[#94A3B8]">Node.js with Express.js</p>
              </div>
              <div className="bg-[#111C2D] p-6 rounded-[12px] border border-[rgba(14,165,233,0.1)] transition-transform transform hover:scale-105 hover:border-[rgba(14,165,233,0.3)]">
                <h3 className="text-2xl font-semibold text-[#E2E8F0] mb-2">Database</h3>
                <p className="text-[#94A3B8]">MongoDB</p>
              </div>
            </div>

            {/* Call to Action */}
            <div className="mt-12 flex justify-center">
              <button className="bg-[#0EA5E9] hover:bg-[#38BDF8] text-[#080C14] font-bold py-3 px-8 rounded-lg shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:scale-105 transform transition">
                Learn More
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;




