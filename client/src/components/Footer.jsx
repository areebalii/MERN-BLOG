import { Link } from 'react-router-dom';
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-white border-t border-gray-100 py-10 mt-auto">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">

          {/* Brand Section */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <div className="bg-purple-600 text-white p-1 rounded text-xs font-bold w-6 h-6 flex items-center justify-center">
                G
              </div>
              <span className="text-xl font-bold tracking-tight">G-BLOG</span>
            </div>
            <p className="text-gray-500 text-sm leading-relaxed">
              A platform for sharing thoughts, tutorials, and stories with the world. Built with the MERN stack.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-gray-900">Explore</h4>
            <ul className="flex flex-col gap-2 text-sm text-gray-500">
              <li><Link to="/" className="hover:text-purple-600 transition-colors">Latest Posts</Link></li>
              <li><Link to="/about" className="hover:text-purple-600 transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-purple-600 transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="hover:text-purple-600 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Social & Newsletter */}
          <div className="flex flex-col gap-4">
            <h4 className="font-semibold text-gray-900">Follow Us</h4>
            <div className="flex gap-4 text-xl text-gray-400">
              <a href="#" className="hover:text-gray-900 transition-colors"><FaGithub /></a>
              <a href="#" className="hover:text-purple-500 transition-colors"><FaTwitter /></a>
              <a href="#" className="hover:text-blue-600 transition-colors"><FaLinkedin /></a>
            </div>
            <p className="text-xs text-gray-400 mt-2">
              Stay updated with our latest news.
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-100 mt-10 pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-xs">
            © {currentYear} G-Blog. All rights reserved.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <span>Made with ❤️ by Vaibhav</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;