import { useState,useEffect } from "react";
import { ShoppingCart, Person2 } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { Badge } from '@mui/material';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import LogoutIcon from '@mui/icons-material/Logout';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from "../store/auth-slice";
import LoginIcon from '@mui/icons-material/Login';
import {getTotals} from '../store/cart-slice'
function UserDropdownMenu({ currentUser, totalQantity }) {
    const [isOpen, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const cart = useSelector((store) => store.cart);

    const toggleMenu = () => {
        setIsOpen(!isOpen);
    };

    const logoutHandler = () => {
        dispatch(logout());
    };

    useEffect(() => {
        dispatch(getTotals());
    }, [cart, dispatch]);

    return (
        <div className="relative">
            <button
                className="flex items-center text-sm font-medium text-gray-700 hover:text-gray-900 focus:outline-none focus:underline"
                onClick={toggleMenu}
            >
                {currentUser ? (
                    <>
                        <Badge
                            badgeContent={`${totalQantity || 0}`}
                            color="error"
                            className="cursor-pointer hover:text-rose-600 mx-5"
                        >
                            <img
                                className="w-8 h-8 rounded-full"
                                src={`${currentUser.image ? currentUser.image : "https://images.unsplash.com/photo-1610397095767-84a5b4736cbd?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=750&q=80"}`}
                                alt=""
                            />
                        </Badge>
                        <span className="hidden sm:inline">{currentUser?.username}</span>
                    </>
                ) : (
                    <Link
                        className="block px-4 py-2 space-x-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        to='/login'
                    >
                        <LoginIcon />
                        Giriş yap
                    </Link>
                )}
            </button>
            {isOpen && (
                <div className="absolute z-50 py-2 bg-white rounded-md shadow-lg">
                    {currentUser && (
                        <Link
                            className="block px-4 py-2 text-center text-sm text-gray-700 hover:bg-gray-100 hover:text-rose-500"
                            to='/cart'
                        >
                            <Badge
                                badgeContent={`${totalQantity}`}
                                color="error"
                                className="cursor-pointer hover:text-rose-600 mx-5"
                            >
                                <ShoppingCart />
                            </Badge>
                            Sepet
                        </Link>
                    )}
                    {currentUser && (
                        <div>
                            <Link
                                className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-rose-500"
                                to='/profile'
                            >
                                <Badge
                                    color='primary'
                                    className='cursor-pointer mx-5 hover:text-rose-600'
                                >
                                    <Person2 />
                                </Badge>
                                Profil
                            </Link>
                        </div>
                    )}
                    {currentUser?.isAdmin && (
                        <div>
                            <Link
                                className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-rose-500"
                                to='/admin'
                            >
                                <Badge
                                    color='primary'
                                    className='cursor-pointer hover:text-rose-600 mx-5'
                                >
                                    <AdminPanelSettingsIcon />
                                </Badge>
                                Admin
                            </Link>
                        </div>
                    )}
                    {currentUser && (
                        <div>
                            <Link
                                onClick={logoutHandler}
                                className="block text-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-rose-500"
                                to='/'
                            >
                                <Badge
                                    color='primary'
                                    className='cursor-pointer hover:text-rose-600 mx-5'
                                >
                                    <LogoutIcon />
                                </Badge>
                                Çıkış Yap
                            </Link>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserDropdownMenu;