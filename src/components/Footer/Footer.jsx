import { Link } from 'react-router-dom';
import logo from '../../assets/freshcart-logo.svg';
import { useContext } from 'react';
import { authContext } from '../../context/Auth/Auth';

export default function Footer() {
  const { userToken } = useContext(authContext);

  return (
    <footer className="bg-white border-t mt-6 dark:bg-gray-900">
      <div className="p-6 mx-auto max-w-6xl">
        <div className="lg:flex lg:justify-center lg:items-start text-center lg:text-left">
          {/* Logo & Description */}
          <div className="w-full lg:w-2/5 px-6">
            <a href="#" className="flex justify-center lg:justify-start">
              <img className="w-auto h-8" src={logo} alt="Site Logo" />
            </a>
            <div className="max-w-sm mt-2 text-gray-500 dark:text-gray-400 mx-auto lg:mx-0">
              Discover More, Spend Less - Shop the Best at Your Fingertips!
            </div>
          </div>

          {/* Navigation & Contact */}
          <div className="mt-6 lg:mt-0 lg:flex-1 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10 justify-items-center">
            {/* Jump To */}
            <div>
              <h3 className="text-gray-700 uppercase dark:text-white">Jump to</h3>
              {userToken ? (
                <>
                  <Link to="/" className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                    <i className="fa-fw fas fa-home"></i> Home
                  </Link>
                  <Link to="/wishlist" className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                    <i className="fa-fw fas fa-heart"></i> Wishlist
                  </Link>
                  <Link to="/cart" className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                    <i className="fa-fw fas fa-shopping-cart"></i> Cart
                  </Link>
                  <Link to="/brands" className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                    <i className="fa-fw fas fa-tags"></i> Brands
                  </Link>
                  <Link to="/categories" className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                    <i className="fa-fw fas fa-list"></i> Categories
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                    <i className="fas fa-sign-in-alt"></i> Login
                  </Link>
                  <Link to="/register" className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                    <i className="fas fa-user-plus fa-fw"></i> Register
                  </Link>
                </>
              )}
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-gray-700 uppercase dark:text-white">Contact</h3>
              <span className="block mt-2 text-sm text-gray-600 dark:text-gray-400 hover:underline">
                <a href="mailto:onkarunde8@gmail.com">onkarunde8@gmail.com</a>
              </span>
              <span className="block space-x-2 mt-2 text-sm text-gray-600 dark:text-gray-400">
                <a href="https://www.linkedin.com/in/onkar-unde/" target="_blank" rel="noopener noreferrer">
                  <i className="fa-lg fa-fw fab fa-linkedin"></i>
                </a>
                <a href="https://github.com/Onkar-Unde" target="_blank" rel="noopener noreferrer">
                  <i className="fa-lg fa-fw fab fa-github"></i>
                </a>
                <a href="mailto:onkarunde8@gmail.com" target="_blank" rel="noopener noreferrer">
                  <i className="fa-lg fa-fw far fa-envelope"></i>
                </a>
                <a href="https://leetcode.com/problemset/" target="_blank" rel="noopener noreferrer">
                  <svg className="inline text-sm" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M13.483 0a1.37 1.37 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.3 5.3 0 0 0-1.209 2.104a5 5 0 0 0-.125.513a5.5 5.5 0 0 0 .062 2.362a6 6 0 0 0 .349 1.017a5.9 5.9 0 0 0 1.271 1.818l4.277 4.193l.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.38 1.38 0 0 0-1.951-.003l-2.396 2.392a3.02 3.02 0 0 1-4.205.038l-.02-.019l-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.7 2.7 0 0 1 .066-.523a2.55 2.55 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.94-.207a1.384 1.384 0 0 0-.207-1.943l-3.5-2.831c-.8-.647-1.766-1.045-2.774-1.202l2.015-2.158A1.384 1.384 0 0 0 13.483 0m-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382a1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382a1.38 1.38 0 0 0-1.38-1.382z"
                    />
                  </svg>
                </a>
              </span>
            </div>
          </div>
        </div>

        {/* Quote */}
        <hr className="h-px my-4 bg-gray-200 border-none dark:bg-gray-700" />
        <div className="text-center text-gray-500 dark:text-gray-400">
          &quot;It does not matter how slowly you go as long as you do not stop.&quot; - <span className="italic text-md">Confucius</span>
        </div>

        {/* Credits */}
        <div className="text-center italic py-3 text-gray-500 dark:text-gray-400">
          Made with love and passion by Onkar
        </div>
      </div>
    </footer>
  );
}
