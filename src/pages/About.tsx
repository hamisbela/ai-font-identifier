import React from 'react';

export default function About() {
  return (
    <div className="bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8 text-center">About Us</h1>
        
        <div className="bg-white rounded-xl shadow-lg p-8 prose max-w-none">
          <p>
            Welcome to AI Font Identifier, your go-to resource for AI-powered font recognition.
            We're passionate about typography and helping designers, marketers, and enthusiasts identify
            and discover beautiful fonts through advanced technology that analyzes images and recognizes typefaces.
          </p>

          <h2>Our Mission</h2>
          <p>
            Our mission is to make font identification accessible to everyone by providing a free, easy-to-use
            tool. We aim to help creative professionals and typography enthusiasts quickly identify fonts they encounter,
            find similar alternatives, and learn more about the rich world of typography.
            Our tool is designed to support the design community by removing the frustration of unidentified fonts and
            helping more people appreciate the art and science of typography.
          </p>

          <h2>Why Choose Our Tool?</h2>
          <ul>
            <li>Advanced AI font recognition technology</li>
            <li>Detailed font information and history</li>
            <li>Similar font recommendations</li>
            <li>Commercial usage information</li>
            <li>Links to font foundries and download sources</li>
            <li>Completely free to use</li>
            <li>No registration required</li>
            <li>Privacy-focused approach</li>
            <li>Regular updates to improve accuracy</li>
          </ul>

          <h2>Support Our Project</h2>
          <p>
            We're committed to keeping this font identification tool free and accessible to everyone.
            If you find our tool useful, consider supporting us by buying us a coffee.
            Your support helps us maintain and improve the service, ensuring it remains available to all
            typography enthusiasts and design professionals who need to identify fonts quickly and accurately.
          </p>

          <div className="mt-8 text-center">
            <a
              href="https://roihacks.gumroad.com/l/dselxe?utm_campaign=donation-home-page&utm_medium=website&utm_source=ai-font-identifier"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg hover:bg-yellow-500 transition-colors text-lg font-semibold"
            >
              Support Our Work
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}