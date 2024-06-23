
import React, { useState, useEffect } from "react";
import axios from "axios"
import { useSelector } from 'react-redux';
import { HiMenuAlt3 } from "react-icons/hi";
import { MdOutlineDashboard } from "react-icons/md";
import { RiSettings4Line } from "react-icons/ri";
import { TbReportAnalytics } from "react-icons/tb";
import { AiOutlineUser, AiOutlineHeart } from "react-icons/ai";
import { SlBasket } from "react-icons/sl";
import {FiLogOut, FiShoppingCart } from "react-icons/fi";
import { Link, Switch, Route } from "react-router-dom";
import AdminHeader from "../components/Admin/AdminHeader";
import { MdOutlineCategory } from "react-icons/md";
import { BsBasket2 } from "react-icons/bs";
import { publicRequest } from '../request-methods';

function AdminSidebar() {

    const currentUser = useSelector((store) => store.auth?.currentUser);
    console.log(currentUser._id, "ccc");
    const [users, setUsers] = useState([]);


    const getUser = async () => {
        try {
            const url = `/users/${currentUser._id}`; //For the Home Page
            const response = await publicRequest.get(url);
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUser();
    }, []);



    const menus = [
        { name: "dashboard", link: "/admin", icon: MdOutlineDashboard },
        { name: "Ürünler", link: "/admin/product", icon: FiShoppingCart },
        { name: "Kategoriler", link: "/admin/categories", icon: MdOutlineCategory },
        { name: "Siparişler", link: "/admin/order", icon: BsBasket2 },
        { name: "Çıkış", link: "/", icon: FiLogOut },
    ];
    const [open, setOpen] = useState(true);
    return (


        <div
            className={`bg-[#0e0e0e] min-h-screen sticky top-0  ${open ? "w-72" : "w-16"
                } duration-500 text-gray-100 px-4 sticky top-0`}
        >
            <div className="mt-4 flex flex-col gap-4  fixed top-0 ">
                <div className="py-3 flex  justify-end   ">
                    <div className="flex items-center space-x-4">
                        <img className="w-10 h-10 rounded-full" src={users.image} alt="" />
                        <div className={`${!open && "opacity-0 translate-x-28 overflow"}   right-0 font-medium dark:text-white`}>
                            <div>{users.username}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">Joined in August 2014</div>
                        </div>
                    </div>

                </div>
                {menus?.map((menu, i) => (
                    <Link
                        to={menu?.link}
                        key={i}
                        className={` ${menu?.margin && "mt-5"
                            } group flex items-center text-sm  gap-3.5 font-medium p-2 hover:bg-gray-800 rounded-md`}
                    >
                        <div>{React.createElement(menu?.icon, { size: "20" })}</div>
                        <h2
                            style={{
                                transitionDelay: `${i + 3}00ms`,
                            }}
                            className={`whitespace-pre duration-500 ${!open && "opacity-0 translate-x-28 overflow-hidden"
                                }`}
                        >
                            {menu?.name}
                        </h2>
                        <h2
                            className={`${open && "hidden"
                                } absolute left-48 z-30 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
                        >
                            {menu?.name}
                        </h2>
                    </Link>
                ))}
            </div>
        </div>

    )
}

export default AdminSidebar