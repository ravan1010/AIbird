import React from "react";

export default function ContactUs() {


  return (
    <div className="min-h-screen bg-gray-900 text-white px-6 py-16 flex flex-col items-center">
      <div className="max-w-xl w-full">
        <h1 className="text-4xl font-bold text-center mb-8">Contact Us</h1>        

        <div className="text-center text-gray-300 mt-6">
          <p>Have feedback, bug reports, feature ideas, or collaboration requests?
            We’d love to hear from you!</p>
            <p className="mt-4">Email us at: <a href='ravanravana177@gmail.com' className="text-blue-400 underline">    
            ravanravana177@gmail.com</a></p>
            <p>Website: <a href="https://evo10.in/">evo10.in</a></p>
        </div>
      </div>
    </div>
  );
}
