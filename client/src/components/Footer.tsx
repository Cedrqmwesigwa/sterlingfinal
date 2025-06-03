import { Link } from "wouter";
import { Facebook, Twitter, Linkedin, Instagram, Phone, Mail, MapPin, Clock } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-sterling-navy text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-12 bg-sterling-gold rounded-lg flex items-center justify-center">
                <span className="text-white text-xl font-bold">S</span>
              </div>
              <div>
                <h3 className="text-xl font-bold">Sterling</h3>
                <p className="text-xs text-sterling-gold">CONTRACTORS</p>
              </div>
            </div>
            <p className="text-gray-300 mb-4 leading-relaxed">
              Premier construction and hardware solutions in Uganda. Building dreams with quality, innovation, and trust.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-sterling-gold/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-sterling-gold transition-colors duration-200">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="bg-sterling-gold/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-sterling-gold transition-colors duration-200">
                <Twitter className="w-5 h-5" />
              </a>
              <a href="#" className="bg-sterling-gold/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-sterling-gold transition-colors duration-200">
                <Linkedin className="w-5 h-5" />
              </a>
              <a href="#" className="bg-sterling-gold/20 w-10 h-10 rounded-full flex items-center justify-center hover:bg-sterling-gold transition-colors duration-200">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold text-sterling-gold mb-4">Services</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/services" className="text-gray-300 hover:text-sterling-gold transition-colors duration-200">
                  Residential Construction
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-sterling-gold transition-colors duration-200">
                  Commercial Buildings
                </Link>
              </li>
              <li>
                <Link href="/services" className="text-gray-300 hover:text-sterling-gold transition-colors duration-200">
                  Renovations
                </Link>
              </li>
              <li>
                <Link href="/shop" className="text-gray-300 hover:text-sterling-gold transition-colors duration-200">
                  Hardware Supply
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-sterling-gold transition-colors duration-200">
                  Project Management
                </a>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold text-sterling-gold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-gray-300 hover:text-sterling-gold transition-colors duration-200">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/projects" className="text-gray-300 hover:text-sterling-gold transition-colors duration-200">
                  Our Projects
                </Link>
              </li>
              <li>
                <Link href="/deposit" className="text-gray-300 hover:text-sterling-gold transition-colors duration-200">
                  Make Deposit
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-300 hover:text-sterling-gold transition-colors duration-200">
                  Contact Us
                </Link>
              </li>
              <li>
                <a href="#" className="text-gray-300 hover:text-sterling-gold transition-colors duration-200">
                  Get Quote
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold text-sterling-gold mb-4">Contact Info</h4>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-sterling-gold" />
                <span className="text-gray-300">+256 751 979 777</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-sterling-gold" />
                <span className="text-gray-300">mctyptys@gmail.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="w-5 h-5 text-sterling-gold" />
                <span className="text-gray-300">Kampala, Uganda</span>
              </div>
              <div className="flex items-center space-x-3">
                <Clock className="w-5 h-5 text-sterling-gold" />
                <span className="text-gray-300">Mon-Sat: 8AM-6PM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-sterling-gold/20 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0">
              &copy; 2024 Sterling Contractors. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-sterling-gold transition-colors duration-200">
                Privacy Policy
              </a>
              <a href="#" className="text-gray-400 hover:text-sterling-gold transition-colors duration-200">
                Terms of Service
              </a>
              <a href="#" className="text-gray-400 hover:text-sterling-gold transition-colors duration-200">
                Deposit Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
