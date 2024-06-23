import  React, { useState } from "react";
import {useQuery, useMutation, useQueryClient} from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../../firebase";
import { publicRequest } from "../../request-methods";
import { ToastContainer, toast } from "react-toastify";
// Modal component
function UpdateProductModal({ setOnClose, product, productId }) {
    const { token } = useSelector((state) => state.auth);
    const queryClient = useQueryClient();
    const [previewImage, setPreviewImage] = useState(product?.image ?? "");
    const [newCategory, setNewCategory] = useState("");

    const fetchCategories = async () => {
        const response = await axios.get('http://localhost:5000/api/categories');
        return response.data;
    };

    const { data: categories, isLoading: isCategoriesLoading } = useQuery(['categories'], fetchCategories, {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 60,
    });

    const updateUser = async (userData) => {
        const response = await axios.put(`http://localhost:5000/api/products/${productId}`, userData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };

    const addCategory = async (category) => {
        const response = await axios.post('http://localhost:5000/api/categories', { name: category }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };

    const { mutate: mutateCategory } = useMutation(addCategory, {
        onSuccess: () => {
            queryClient.invalidateQueries("categories");
            toast.success("Kategori başarıyla eklendi");
            setNewCategory("");
        },
        onError: () => {
            toast.error("Kategori eklenirken bir hata oluştu");
        },
    });

    const { mutate } = useMutation(updateUser);

    const formik = useFormik({
        initialValues: {
            title: product?.title ?? "",
            category: product?.category[0] ?? "",
            description: product?.description ?? "",
            price: product?.price ?? "",
            image: product?.image ?? "",
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Başlık gereklidir"),
            category: Yup.string().required("Kategori gereklidir"),
            description: Yup.string().required("Açıklama gereklidir"),
            price: Yup.number().required("Fiyat gereklidir").positive("Fiyat pozitif bir sayı olmalıdır"),
        }),
        onSubmit: async (values) => {
            handleClick(values);
        },
    });

    const handleClick = async (values) => {
        if (typeof values.image === "object") {
            const imageName = "pp/" + values.image.name + new Date().getTime();
            const storage = getStorage(app);
            const storageRef = ref(storage, imageName);
            const uploadTask = uploadBytesResumable(storageRef, values.image);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                },
                (error) => {
                    console.error(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const userData = { ...formik.values, image: downloadURL };
                        mutate(userData, {
                            onSuccess: () => {
                                queryClient.invalidateQueries("products");
                                toast.success("Ürün başarıyla güncellendi");
                                setOnClose(false);
                            },
                            onError: () => {
                                toast.error("Ürün güncellenirken bir hata oluştu");
                            },
                        });
                    });
                }
            );
        } else {
            const userData = { ...formik.values };
            mutate(userData, {
                onSuccess: () => {
                    toast.success("Ürün başarıyla güncellendi");
                    setOnClose(false);
                },
                onError: () => {
                    toast.error("Form gönderilirken bir hata oluştu");
                },
            });
        }
    };

    const handleImageChange = (event) => {
        const file = event.currentTarget.files[0];
        if (file) {
            formik.setFieldValue("image", file);
            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleAddCategory = () => {
        if (newCategory.trim()) {
            mutateCategory(newCategory.trim());
        }
    };

    return (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full">
            <div className="absolute top-0 left-0 z-40 w-full h-full bg-gray-900 opacity-50"></div>
            <div className="z-50 w-1/2 px-6 py-4 bg-white rounded shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Ürünü Güncelle</h2>
                <form onSubmit={formik.handleSubmit} className="max-w-md mx-auto mt-4">
                    <div className="mb-4">
                        <label htmlFor="title" className="block mb-2 text-sm font-medium text-gray-700">Başlık</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={formik.values.title}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formik.touched.title && formik.errors.title ? "border-red-500" : "border-gray-300"}`}
                            placeholder="Başlık giriniz"
                        />
                        {formik.touched.title && formik.errors.title && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.title}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="description"
                               className="block mb-2 text-sm font-medium text-gray-700">Açıklama</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formik.values.description}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formik.touched.description && formik.errors.description ? "border-red-500" : "border-gray-300"}`}
                            placeholder="Açıklama giriniz"
                        />
                        {formik.touched.description && formik.errors.description && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.description}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="category" className="block mb-2 text-sm text-gray-700">Kategori</label>
                        <div className="flex items-center gap-2">
                            <select
                                id="category"
                                name="category"
                                value={formik.values.category}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                                className="block w-full px-2 py-2  text-sm bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                {categories && categories.map((category) => (
                                    <option key={category._id} value={category._id}>{category.name}</option>
                                ))}
                            </select>
                        </div>
                        {formik.touched.category && formik.errors.category && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.category}</p>
                        )}
                    </div>

                    <div className="mb-4">
                        <label htmlFor="price" className="block mb-2 text-sm font-medium text-gray-700">Fiyat</label>
                        <input
                            id="price"
                            name="price"
                            type="number"
                            value={formik.values.price}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className={`appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm ${formik.touched.price && formik.errors.price ? "border-red-500" : "border-gray-300"}`}
                            placeholder="Fiyat giriniz"
                        />
                        {formik.touched.price && formik.errors.price && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.price}</p>
                        )}
                    </div>
                    <div className="mb-4">
                        <label htmlFor="image" className="block mb-2 text-sm font-medium text-gray-700">Görsel</label>
                        {previewImage && <img src={previewImage} alt="Product" className="mb-4 w-32 h-32 object-cover" />}
                        <input
                            id="image"
                            name="image"
                            type="file"
                            accept=".png,.jpg,.jpeg"
                            onChange={handleImageChange}
                            className="appearance-none block w-full px-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                        {formik.touched.image && formik.errors.image && (
                            <p className="mt-2 text-sm text-red-600">{formik.errors.image}</p>
                        )}
                    </div>
                    <div className="flex justify-end">
                        <button type="button" className="mr-4 px-4 py-2 text-gray-700 bg-gray-200 rounded hover:bg-gray-300" onClick={() => setOnClose(false)}>İptal</button>
                        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">Kaydet</button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default UpdateProductModal;