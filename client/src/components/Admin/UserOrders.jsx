import React from 'react'
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSelector, useDispatch } from 'react-redux';

import axios from 'axios';
import { Link } from "react-router-dom";
function UserOrders() {
    const { currentUser } = useSelector((store) => store.auth);
    const { token } = useSelector((state) => state.auth);

    const {
        isLoading,
        isError,
        data: orders,
        error,
    } = useQuery({
        queryKey: ["orders"],
        queryFn: () => axios.get(`http://localhost:5000/api/orders`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }),
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div>An error has occurred: {error.message}</div>;

    console.log(orders)
    const userOrders = orders.data.filter(order => order.userId._id === currentUser._id);

    console.log(userOrders)

    return (
        <div className="m-3 text-xl text-gray-900 font-semibold w-full overflow-hidden">
            <div className="mt-6 lg:mt-0 lg:px-2">
                <div className="flex items-center justify-between text-sm tracking-widest uppercase">
                    <p className="text-gray-500 dark:text-gray-300 py-2">Siparişler</p>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-screen">
                    <table className="w-full text-sm text-start text-gray-500 dark:text-gray-400">
                        <thead className="text-xs sticky top-0 text-gray-700 uppercase bg-gray-50">
                        <tr className='text-start'>
                            <th scope="col" className="text-start px-6 py-3">Ürün</th>
                            <th scope="col" className="text-start px-6 py-3">Satıcı</th>
                            <th scope="col" className="text-start px-6 py-3">Adres</th>
                            <th scope="col" className="text-start px-6 py-3">Durum</th>
                            <th scope="col" className="text-start px-6 py-3">Fiyat</th>
                            <th scope="col" className="text-start px-6 py-3">Teslimat Kodu</th>
                            <th scope="col" className="text-start px-6 py-3">Tarih Aralığı</th>
                            <th scope="col" className="text-start px-6 py-3">İşlem</th>
                        </tr>
                        </thead>
                        <tbody>
                        {userOrders.map((order) => (
                            <tr key={order._id} className="bg-white border-b h-full">
                                <td className="p-4">
                                    <div className='flex gap-1'>
                                        {order.products.map((product, key) => (
                                            <div key={key} className='flex flex-col border-2'>
                                                <img className='w-16 h-24' src={product?.product.image} alt=""/>
                                                <div className='text-center'>
                                                    <p>{product.quantity}x₺{(product.quantity * product?.product.price)}.00</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    <div>
                                        <span className="font-medium">Adı:</span> <span
                                        className='text-teal-600'>{order.provider.username}</span>
                                    </div>
                                    <div>
                                        <span className="font-medium">Email:</span> {order.provider.email}
                                    </div>

                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    <div>
                                        <span className="font-medium">Ülke:</span> {order.address.country}
                                    </div>
                                    <div>
                                        <span className="font-medium">Sokak:</span> {order.address.street}
                                    </div>
                                    <div>
                                        <span className="font-medium">Spariş tarihi:</span> <span
                                        className='text-teal-600'>{new Date(order.createdAt).toLocaleString()}</span>
                                    </div>
                                </td>

                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    <div className='flex gap-1 items-center'>
                                        <div
                                            className={`${order.status === "Reddedildi" ? "bg-sky-500 h-2 w-2 rounded-full" : "bg-teal-500 h-2 w-2 rounded-full"}`}></div>
                                        <span
                                            className={`${order.status === "Reddedildi" ? "text-xs font-normal text-sky-500" : "text-xs font-normal text-teal-500"}`}>{order.status}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">₺{order.amount}.00</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">{order.deliveryCode || "N/A"}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    {new Date(order.startDate).toLocaleDateString()} - {new Date(order.endDate).toLocaleDateString()}
                                </td>
                                <td className="p-8 flex justify-center items-center w-full h-full">
                                    {order.status === "Bekleniyor" && (
                                        <div className="mt-2 flex gap-2">
                                            <button
                                                className="group text-sm inline-flex w-full items-center justify-center rounded-md bg-teal-500 px-2 py-3 font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
                                                İptal Et
                                            </button>
                                        </div>
                                    )}
                                    {order.status === "Reddedildi" && (
                                        <div className="mt-2 flex gap-2">
                                            <div
                                                className="group text-sm inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-2 py-3 font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
                                                Spariş İptal edildi
                                            </div>
                                        </div>
                                    )}
                                    {order.status === "Şpariş Hazır" && (
                                        <div className="mt-2 flex flex-col items-center justify-center h-full gap-2">
                                            <div>Spariş Teslim Kodu <span
                                                className='text-sky-500'>#{order.deliveryCode}</span></div>
                                            <span
                                                className='text-center'>Bu kod ile sparişinizi teslim alabilirsiniz</span>
                                        </div>
                                    )}
                                    {order.status === "Hazırlanıyor" && (
                                        <div className="mt-2 flex gap-2">
                                            <div
                                                className="group text-sm inline-flex w-full items-center justify-center rounded-md bg-sky-500 px-2 py-3 font-semibold text-white transition-all duration-200 ease-in-out focus:shadow hover:bg-gray-800">
                                                Spariş Hazırlanıyor
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default UserOrders;