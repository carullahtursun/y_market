import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import UpdateProductModal from './UpdateProductModal';
import AddProductModal from "./AddProductModal.jsx";

const fetchUserProducts = async () => {
    const response = await axios.get(`http://localhost:5000/api/products`);
    return response.data;
};

function AdminProducts() {
    const userId = useSelector((store) => store.auth.currentUser?._id);
    const token = useSelector((store) => store.auth.token);
    const queryClient = useQueryClient();
    const [onClose, setOnClose] = useState(false);
    const [currentProduct, setCurrentProduct] = useState(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const { data: products, isLoading, error } = useQuery(
        ['userProducts'],
        () => fetchUserProducts(),
        {
            staleTime: 1000 * 60 * 5, // 5 minutes
            cacheTime: 1000 * 60 * 60, // 1 hour
        }
    );
    console.log(products)

    const deleteProduct = async (productId) => {
        try {
            await axios.delete(
                `http://localhost:5000/api/products/${productId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        id: userId,
                    },
                }
            );
            // Invalidate the cache for the "products" query to reflect the changes made
            queryClient.invalidateQueries("products");
            console.log("Product deleted successfully");
        } catch (err) {
            console.log(err);
        }
    };

    const handleEdit = (product) => {
        setCurrentProduct(product);
        setOnClose(true);
    };

    if (isLoading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error.message}</div>;
    }
    console.log(products)

    return (
        <div className="m-3 text-xl text-gray-900 font-semibold w-full overflow-hidden py-4 ">
            <div className="mt-6 lg:mt-0 lg:px-2">
                <div className=" p-2 flex items-center justify-between text-sm tracking-widest uppercase">
                    <p className="text-gray-500 dark:text-gray-300 py-2">{products.length} Ürün</p>
                    <button
                        className="text-white py-2 px-4 uppercase rounded bg-gray-700 hover:bg-sky-500 shadow hover:shadow-lg font-medium transition transform hover:-translate-y-0.5"
                        onClick={() => setIsAddModalOpen(true)}
                    >
                        Ürün Ekle
                    </button>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-screen pb-32">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs sticky top-0 text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Fotoğraf</th>
                            <th scope="col" className="px-6 py-3">Ürün Adı</th>
                            <th scope="col" className="px-6 py-3">Ürün Türü</th>
                            <th scope="col" className="px-6 py-3">Ürün Açıklaması</th>
                            <th scope="col" className="px-6 py-3">Fiyat</th>
                            <th scope="col" className="px-6 py-3 text-center">İşlem</th>
                        </tr>
                        </thead>
                        <tbody>
                        {products.map((product, key) => (
                            <tr key={key} className="bg-white border-b h-full">
                                <td className="w-16 p-4">
                                    <img src={product.image} alt={product.title}
                                         className="object-cover w-full h-32 rounded-md"/>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    {product.title}
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    {product.category.name}
                                </td>
                                <td className="px-6 py-4 text-black max-w-xs">
                                    <p>{product.description}</p>
                                </td>
                                <td className="px-6 py-4 font-semibold text-gray-900">
                                    ₺{product.price}.00
                                </td>
                                <td className="p-8 flex  justify-center gap-2 items-center h-full ">
                                    <button onClick={() => deleteProduct(product._id)}
                                            className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Sil
                                    </button>
                                    <button onClick={() => handleEdit(product)}
                                            className="text-teal-500 hover:text-white border border-teal-500 hover:bg-teal-500 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">Düzenle
                                    </button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
            {onClose && currentProduct && (
                <UpdateProductModal onClose={onClose} setOnClose={setOnClose} productId={currentProduct._id}
                                    product={currentProduct}/>
            )}
            {isAddModalOpen && (
                <AddProductModal setOnClose={setIsAddModalOpen}/>
            )}
        </div>
    );
}

export default AdminProducts;