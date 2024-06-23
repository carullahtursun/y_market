import React, { useState } from "react";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useSelector } from "react-redux";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import app from "../../../firebase";
import { toast } from "react-toastify";

function AddProductModal({ setOnClose }) {
    const { token } = useSelector((state) => state.auth);
    const queryClient = useQueryClient();
    const [previewImage, setPreviewImage] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const addProduct = async (productData) => {
        const response = await axios.post(`http://localhost:5000/api/products`, productData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    };

    const { mutate } = useMutation(addProduct, {
        onSuccess: () => {
            queryClient.invalidateQueries("products");
            toast.success("Ürün başarıyla eklendi");
            setOnClose(false);
            setIsSubmitting(false);
        },
        onError: () => {
            toast.error("Ürün eklenirken bir hata oluştu");
            setIsSubmitting(false);
        },
    });

    const fetchCategories = async () => {
        const response = await axios.get('http://localhost:5000/api/categories');
        return response.data;
    };

    const { data: categories, isLoading: isCategoriesLoading } = useQuery(['categories'], fetchCategories, {
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 60,
    });

    const formik = useFormik({
        initialValues: {
            title: "",
            category: "",
            description: "",
            price: "",
            image: "",
        },
        validationSchema: Yup.object({
            title: Yup.string().required("Başlık gereklidir"),
            category: Yup.string().required("Kategori gereklidir"),
            description: Yup.string().required("Açıklama gereklidir"),
            price: Yup.number().required("Fiyat gereklidir").positive("Fiyat pozitif bir sayı olmalıdır"),
        }),
        onSubmit: (values) => {
            setIsSubmitting(true);
            console.log(values)
            handleSubmit(values);
        },
    });



    const handleSubmit = async (values) => {
        if (values.image) {
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
                    setIsSubmitting(false);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        const productData = { ...formik.values, image: downloadURL };
                        mutate(productData);
                    });
                }
            );
        } else {
            const productData = { ...formik.values };
            mutate(productData);
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

    return (
        <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full">
            <div className="absolute top-0 left-0 z-40 w-full h-full bg-gray-900 opacity-50"></div>
            <div className="z-50 w-1/2 px-6 py-4 bg-white rounded shadow-lg">
                <h2 className="mb-4 text-xl font-bold">Ürün Ekle</h2>
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
                        <label htmlFor="category"
                               className="block mb-2 text-sm font-medium text-gray-700">Kategori</label>
                        <select
                            id="category"
                            name="category"
                            value={formik.values.category}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            className="block w-full px-4 py-2 mt-2 text-sm bg-white border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
                        >
                            <option value="">Kategori seçin</option>
                            {categories && categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
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
                        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600" disabled={isSubmitting}>
                            {isSubmitting ? "Kaydediliyor..." : "Kaydet"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default AddProductModal;