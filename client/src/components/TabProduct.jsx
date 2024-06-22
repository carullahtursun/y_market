import { useState } from 'react'
import { FavoriteBorderRounded, Inventory } from '@mui/icons-material';
import UserProduct from './UserProduct';

import LikeProduct from './LikeProduct';
import { NavLink } from 'react-router-dom';
import UserOrders from './Admin/UserOrders';
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';

function TabProduct({ userID }) {


    const { currentUser } = useSelector((store) => store.auth);
    const [isClick, setIsClick] = useState(1)

    return (

        <div>
            <div className={`${currentUser?.isAdmin ? "grid-cols-2" :"grid-cols-2"} grid  gap-5`}>
                {/*<button
                    className={` p-4 rounded  ${isClick == 1 ? 'bg-sky-500 text-white ' : 'bg-white text-black'} shadow-md flex items-center justify-center`}
                    onClick={(e) => setIsClick(1)}
                >
                    <Inventory />
                    Satiş
                </button>*/}


                <button
                    className={` p-4 rounded  ${isClick == 1 ? 'bg-sky-500 text-white ' : 'bg-white text-black'} shadow-md flex items-center justify-center`}
                    onClick={(e) => setIsClick(1)}
                >
                    <FavoriteBorderRounded />


                </button>
                {
                    !currentUser.isAdmin && 

                        <button
                            className={` p-4 rounded  ${isClick == 2 ? 'bg-sky-500 text-white ' : 'bg-white text-black'} shadow-md flex items-center justify-center`}
                            onClick={(e) => setIsClick(2)}
                        >
                            <Inventory />
                            Spariş
                        </button>
                    
                }

            </div>

           {/* {
                isClick == 1 && <div className='mt-5'>
                    <UserProduct userID={userID} />
                </div>
            }*/}
            {
                isClick == 1 && <div className='mt-5'>

                    <LikeProduct userID={userID} />
                </div>
            }

            {
              

                    isClick == 2 && <div className='mt-5'>

                        <UserOrders userID={userID} />
                    </div>
                
            }


        </div>
    )
}

export default TabProduct