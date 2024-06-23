import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const fetchCategories = async () => {
    const response = await axios.get('http://localhost:5000/api/categories');
    return response.data;
};

function AdminCategories() {
    const token = useSelector((store) => store.auth.token);
    const queryClient = useQueryClient();
    const [categoryName, setCategoryName] = useState('');
    const [isEdit, setIsEdit] = useState(false);
    const [currentCategory, setCurrentCategory] = useState(null);

    const { data: categories, isLoading, error } = useQuery(['categories'], fetchCategories, {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 60,
    });

    const createCategory = useMutation(
        async (newCategory) => {
            const response = await axios.post('http://localhost:5000/api/categories', newCategory, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('categories');
                toast.success('Kategori başarıyla eklendi');
                setCategoryName('');
            },
            onError: () => {
                toast.error('Kategori eklenirken bir hata oluştu');
            },
        }
    );

    const updateCategory = useMutation(
        async (updatedCategory) => {
            const response = await axios.put(`http://localhost:5000/api/categories/${currentCategory._id}`, updatedCategory, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('categories');
                toast.success('Kategori başarıyla güncellendi');
                setCategoryName('');
                setIsEdit(false);
                setCurrentCategory(null);
            },
            onError: () => {
                toast.error('Kategori güncellenirken bir hata oluştu');
            },
        }
    );

    const deleteCategory = useMutation(
        async (categoryId) => {
            const response = await axios.delete(`http://localhost:5000/api/categories/${categoryId}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            return response.data;
        },
        {
            onSuccess: () => {
                queryClient.invalidateQueries('categories');
                toast.success('Kategori başarıyla silindi');
            },
            onError: () => {
                toast.error('Kategori silinirken bir hata oluştu');
            },
        }
    );

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isEdit) {
            updateCategory.mutate({ name: categoryName });
        } else {
            createCategory.mutate({ name: categoryName });
        }
    };

    const handleEdit = (category) => {
        setCategoryName(category.name);
        setCurrentCategory(category);
        setIsEdit(true);
    };

    if (isLoading) return <div>Loading...</div>;
    if (error) return <div>Error loading categories</div>;

    return (
        <div className="m-3 text-xl text-gray-900 font-semibold w-full overflow-hidden">
            <div className="mt-6 lg:mt-0 lg:px-2">
                <div className="flex items-center justify-between text-sm tracking-widest uppercase">
                    <p className="text-gray-500 dark:text-gray-300 py-2">{categories.length} Kategori</p>
                    <form onSubmit={handleSubmit} className="flex space-x-3">
                        <input
                            type="text"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            placeholder="Kategori adı"
                            className="block w-full px-4 py-2 text-black bg-white border border-gray-300 rounded-md"
                        />
                        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
                            {isEdit ? 'Güncelle' : 'Ekle'}
                        </button>
                    </form>
                </div>
                <div className="relative overflow-x-auto shadow-md sm:rounded-lg max-h-screen mt-4">
                    <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                        <thead className="text-xs sticky top-0 text-gray-700 uppercase bg-gray-50">
                        <tr>
                            <th scope="col" className="px-6 py-3">Kategori Adı</th>
                            <th scope="col" className="px-6 py-3 text-center">İşlem</th>
                        </tr>
                        </thead>
                        <tbody>
                        {categories.map((category) => (
                            <tr key={category._id} className="bg-white border-b h-full">
                                <td className="px-6 py-4 font-semibold text-gray-900">{category.name}</td>
                                <td className="p-8 flex justify-center gap-2 items-center h-full ">
                                    <button onClick={() => handleEdit(category)} className="text-teal-500 hover:text-white border border-teal-500 hover:bg-teal-500 focus:ring-4 focus:outline-none focus:ring-teal-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        Düzenle
                                    </button>
                                    <button onClick={() => deleteCategory.mutate(category._id)} className="text-red-500 hover:text-white border border-red-500 hover:bg-red-500 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center">
                                        Sil
                                    </button>
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

export default AdminCategories;
