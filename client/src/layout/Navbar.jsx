


import UserDropdownMenu from '../components/UserDropdownMenu';


import { useEffect, useState } from "react";

import HomeIcon from '@mui/icons-material/Home';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import InfoIcon from '@mui/icons-material/Info';


import { useLocation, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";




const Navbar = () => {
  const cart = useSelector((store) => store.cart);
  const { currentUser } = useSelector((store) => store.auth);
  const location = useLocation();

  useEffect(() => {}, [location]);

  return (
      <>
          <nav className="flex justify-between items-center max-w-screen-xl mx-auto p-4">
            <h1 className='font-bold text-4xl uppercase flex items-center justify-center px-4 tracking-wider'>
              <a href='/'> <span className='text-sky-500'>KIT</span>KAT</a>
            </h1>
            <div className="flex items-center">
              <UserDropdownMenu currentUser={currentUser} totalQantity={cart?.totalQantity} />
            </div>
          </nav>
        <div className="sticky top-0 z-40 shadow-lg bg-white hidden lg:block">
          <nav className="bg-gray-100 border-t border-gray-200">
            <div className="flex justify-center bg-white">
              <ul className="flex justify-self-auto w-full max-w-screen-xl mx-auto p-2">
                {[
                  { to: "/", icon: <HomeIcon className="text-2xl" />, label: "Ana Sayfa" },
                  { to: "/categories/allproduct", icon: <ProductionQuantityLimitsIcon className="text-2xl" />, label: "Ürünler" },
                  { to: "/about", icon: <InfoIcon className="text-2xl" />, label: "Hakkımızda" },
                  { to: "/contact", icon: <ContactMailIcon className="text-2xl" />, label: "İletişim" },
                ].map((item) => (
                    <li key={item.to} className="inline-flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg">
                      <NavLink
                          to={item.to}
                          className={({ isActive }) =>
                              isActive ? "text-sky-500 text-center" : "text-gray-800 text-center"
                          }
                      >
                        {item.icon}
                        <span className="text-sm mb-2">{item.label}</span>
                        <hr className={location.pathname === item.to ? "w-full h-0.5 bg-sky-500 border-0 rounded" : "hidden"} />
                      </NavLink>
                    </li>
                ))}
              </ul>
            </div>
          </nav>
        </div>

        <div className="fixed bottom-0 w-full z-50 lg:hidden bg-gray-100 border-t border-gray-200">
          <div className="w-full h-16 flex justify-center bg-white">
            <ul className="flex justify-between w-full max-w-screen-xl mx-auto p-2">
              {[
                { to: "/", icon: <HomeIcon className="text-2xl" />, label: "Home" },
                { to: "/categories/allproduct", icon: <ProductionQuantityLimitsIcon className="text-2xl" />, label: "Ürünler" },
                { to: "/about", icon: <InfoIcon className="text-2xl" />, label: "About" },
                { to: "/contact", icon: <ContactMailIcon className="text-2xl" />, label: "Contact" },
              ].map((item) => (
                  <li key={item.to} className="inline-flex flex-col items-center justify-center p-3 hover:bg-gray-50 rounded-lg">
                    <NavLink
                        to={item.to}
                        className={({ isActive }) =>
                            isActive ? "text-sky-500 text-center" : "text-gray-800 text-center"
                        }
                    >
                      {item.icon}
                      <span className="text-sm mb-2">{item.label}</span>
                      <hr className={location.pathname === item.to ? "w-full h-0.5 bg-sky-500 border-0 rounded" : "hidden"} />
                    </NavLink>
                  </li>
              ))}
            </ul>
          </div>
        </div>
      </>
  );
};

export default Navbar;