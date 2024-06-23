import React, { Fragment } from 'react'
import TabProduct from './TabProduct'
import {FavoriteBorderRounded, Inventory, MoreHoriz, SetMeal, Settings} from '@mui/icons-material';
import { useSelector, useDispatch } from 'react-redux';
import AddProduct from './AddProduct';
import { useEffect, useState } from 'react';
import { publicRequest } from '../request-methods';
import SettingsIcon from '@mui/icons-material/Settings';
import UpdateUserModal from './Admin/UpdateUserModal';


function ProfilePage({ UserID }) {
    const [onClose, setOnClose] = useState(false);
    const [users, setUsers] = useState({});
    const [modal, setModal] = useState(false);
    const { currentUser } = useSelector((store) => store.auth);

    const getUsers = async () => {
        try {
            const url = `/users/${UserID}`; //For the Home Page
            const response = await publicRequest.get(url);
            setUsers(response.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        getUsers();
    }, [UserID]);

    return (
        <>
            <Fragment>
                <div className="lg:p-16 md:p-12 p-1">
                    <div className="p-8 bg-white shadow mt-24 rounded-lg">
                        <div className="grid grid-cols-1 md:grid-cols-3 items-center">
                            <div className="grid grid-cols-2 text-center order-last md:order-first mt-20 md:mt-0">
                                <div>
                                    <p className="font-bold text-gray-700 text-xl">22</p>
                                    <p className="text-gray-400"><FavoriteBorderRounded /></p>
                                </div>
                                <div>
                                    <p className="font-bold text-gray-700 text-xl">10</p>
                                    <p className="text-gray-400"><Inventory /></p>
                                </div>
                            </div>
                            <div className="relative">
                                <div className="w-48 h-48 bg-indigo-100 mx-auto rounded-full shadow-2xl absolute inset-x-0 top-0 -mt-24 flex items-center justify-center text-indigo-500">
                                    <img className="w-full h-full rounded-full object-cover" src={users?.image ||"https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper-thumbnail.png"} alt="User Avatar" />
                                </div>
                            </div>
                            <div className="space-x-8 flex justify-center mt-32 md:mt-0">
                                <button
                                    onClick={() => setOnClose(true)}
                                    className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-sky-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                                >
                                    Ayarlar {" "}<Settings />
                                </button>
                                <AddProduct userID={UserID} isVisible={modal} onClose={() => setModal(false)} />
                            </div>
                        </div>
                        <div className="mt-20 text-center border-b pb-12">
                            <h1 className="text-4xl font-medium text-gray-700">
                                {users?.username}
                                <span className="font-light text-gray-500">
                </span>
                            </h1>
                            <p className="font-light text-gray-600 mt-3">Bucharest, Romania</p>
                            <p className="mt-8 text-gray-500">Solution Manager - Creative Tim Officer</p>
                            <p className="mt-2 text-gray-500">University of Computer Science</p>
                        </div>
                        <TabProduct userID={UserID} />
                        {onClose && (
                            <UpdateUserModal onClose={onClose} setOnClose={setOnClose} userID={UserID} user={users} />
                        )}
                    </div>
                </div>
            </Fragment>
        </>
    );
}

export default ProfilePage;