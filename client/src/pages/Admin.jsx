import React, { useState, useEffect } from "react";
import axios from "axios";
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';

const fetchStats = async () => {
    const productResponse = await axios.get("http://localhost:5000/api/products");
    const orderResponse = await axios.get("http://localhost:5000/api/orders");
    const userResponse = await axios.get("http://localhost:5000/api/users");

    // Günlük sipariş sayısını hesaplamak için bugün ve yarının tarihlerini alalım
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Bugünün başlangıcı
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Bugünün bitişi

    // Günlük siparişleri filtrele
    const dailyOrders = orderResponse.data.filter(order => {
        const orderDate = new Date(order.createdAt);
        return orderDate >= today && orderDate < tomorrow;
    });

    return {
        productCount: productResponse.data.length,
        orderCount: orderResponse.data.length,
        userCount: userResponse.data.length,
        dailyOrderCount: dailyOrders.length // Günlük sipariş sayısı
    };
};

const fetchUsers = async () => {
    const response = await axios.get("http://localhost:5000/api/users");
    console.log(response)
    return response.data.filter(user => !user.isAdmin);
};

export default function Admin() {
    const [stats, setStats] = useState({
        productCount: 0,
        orderCount: 0,
        userCount: 0,
        dailyOrderCount: 0
    });



    const [users, setUsers] = useState([]);

    useEffect(() => {
        const getStatsAndUsers = async () => {
            const statsData = await fetchStats();
            setStats(statsData);

            const usersData = await fetchUsers();
            setUsers(usersData);
        };

        getStatsAndUsers();
    }, []);

    return (
        <div className="m-3 overflow-hidden w-full py-5 text-xl text-gray-900 font-semibold">
            <div className='flex sm:flex-row space-y-2 sm:space-x-2 flex-col w-full items-center justify-center p-3'>
                <Card title="Toplam Ürün" value={stats.productCount} percentage="100%" icon={<SearchIcon />} color="blue" />
                <Card title="Toplam Sipariş" value={stats.orderCount} percentage="50%" icon={<AttachMoneyIcon />} color="purple" />
                <Card title="Toplam Kullanıcı" value={stats.userCount} percentage="25%" icon={<ContentCopyIcon />} color="red" />
                <Card title="Günlük Sipariş" value={stats.dailyOrderCount} percentage="10%" icon={<DeleteSweepOutlinedIcon />} color="green" />
            </div>

            <div className="mt-4 mx-4">
                <div className="w-full overflow-hidden rounded-lg shadow-xs">
                    <div className="w-full overflow-x-auto">
                        <table className="w-full">
                            <thead>
                            <tr className="text-xs font-semibold tracking-wide text-left text-gray-500 uppercase border-b dark:border-gray-700 bg-gray-50 dark:text-gray-400 dark:bg-gray-800">
                                <th className="px-4 py-3">Kullanıcı</th>
                                <th className="px-4 py-3">Email</th>
                                <th className="px-4 py-3">Durum</th>
                            </tr>
                            </thead>
                            <tbody className="bg-white divide-y dark:divide-gray-700 dark:bg-gray-800">
                            {users.map(user => (
                                <tr key={user._id} className="bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900 text-gray-700 dark:text-gray-400">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center text-sm">
                                            <div className="relative hidden w-8 h-8 mr-3 rounded-full md:block">
                                                <img className="object-cover w-full h-full rounded-full" src={user.avatar} alt="" loading="lazy" />
                                                <div className="absolute inset-0 rounded-full shadow-inner" aria-hidden="true"></div>
                                            </div>
                                            <div>
                                                <p className="font-semibold">{user.username}</p>
                                                <p className="text-xs text-gray-600 dark:text-gray-400">{user.role}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3 text-sm">{user.email}</td>
                                    <td className="px-4 py-3 text-xs">
                      <span className={`px-2 py-1 font-semibold leading-tight ${!user.isActive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"} rounded-full`}>
                        {!user.isActive ? "Aktif" : "Pasif"}
                      </span>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                    <div className="grid px-4 py-3 text-xs font-semibold tracking-wide text-gray-500 uppercase border-t dark:border-gray-700 bg-gray-50 sm:grid-cols-9 dark:text-gray-400 dark:bg-gray-800">
                        <span className="flex items-center col-span-3">Toplam {users.length} kullanıcı gösteriliyor</span>
                    </div>
                </div>
            </div>
        </div>
    );
}

const Card = ({ title, value, percentage, icon, color }) => {
    return (
        <div className={`flex flex-wrap flex-row sm:flex-col justify-center items-center w-full sm:w-1/4 p-5 bg-white rounded-md shadow-xl border-l-4 border-${color}-300`}>
            <div className="flex justify-between w-full">
                <div className="p-2">{icon}</div>
                <div className={`flex items-center text-xs px-3 bg-${color}-200 text-${color}-800 rounded-full`}>{percentage}</div>
            </div>
            <div className={"text-center"}>
                <div className="font-bold text-5xl">{value}</div>
                <div className="font-bold text-sm">{title}</div>
            </div>
        </div>
    );
};