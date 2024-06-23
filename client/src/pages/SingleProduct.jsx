import React, { useState, useEffect } from 'react';
import DocViewer, { DocViewerRenderers } from "@cyntler/react-doc-viewer";
import { Add, Remove } from '@mui/icons-material';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useQuery } from "@tanstack/react-query";
import { publicRequest } from '../request-methods';
import { removeFromCart, decreaseCart, addToCart, getTotals } from '../store/cart-slice';

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Pdfviewer from '../components/Pdfviewer';
import axios from 'axios';


const fetchProduct = async (id) => {
  const response = await axios.get(`http://localhost:5000/api/products/${id}`);
  return response.data;
};

const fetchProductOrders = async (id) => {
  const response = await axios.get(`http://localhost:5000/api/orders/product-orders/${id}`);
  return response.data;
};

const SingleProduct = () => {
  const [modal, setModal] = useState(false);
  const { id } = useParams();
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading: productLoading, isError: productError } = useQuery(['product', id], () => fetchProduct(id));
  const { data: orders, isLoading: ordersLoading, isError: ordersError } = useQuery(['productOrders', id], () => fetchProductOrders(id));

  if (productLoading || ordersLoading) {
    return <div>Loading...</div>;
  }

  if (productError || ordersError) {
    return <div>Error loading product</div>;
  }

  const addToCartHandler = () => {
    dispatch(addToCart({ ...product, quantity }));
  };

  const getRentedDates = (orders) => {
    let rentedDates = [];
    orders.forEach(order => {
      let currentDate = new Date(order.startDate);
      let endDate = new Date(order.endDate);
      while (currentDate <= endDate) {
        rentedDates.push(new Date(currentDate));
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    return rentedDates;
  };

  const rentedDates = getRentedDates(orders);

  return (
      <section className="py-16 px-8 bg-gray-50">
        <div className="container mx-auto grid grid-cols-1 lg:grid-cols-5 gap-12">
          <div className="lg:col-span-2">
            <div className="flex justify-center items-center h-full">
              <img className="w-full max-w-lg rounded-lg shadow-lg object-cover" src={product.image} alt={product.title} />
            </div>
          </div>
          <div className="lg:col-span-3">
            <div className="p-8 bg-white rounded-lg shadow-lg">
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
              <div className="flex items-center mb-4">
                {[...Array(5)].map((_, index) => (
                    <svg key={index} className="h-4 w-4 text-yellow-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <p className="ml-2 text-sm font-medium text-gray-500">1,209 Reviews</p>
              </div>
              <p className="text-lg text-gray-700 mb-6">{product.description}</p>
              <div className="flex items-center mb-4">
                <button onClick={() => setQuantity(quantity - 1)} className="flex items-center justify-center rounded-l-md bg-gray-200 px-4 transition hover:bg-green-500 hover:text-white">
                  <Remove />
                </button>
                <div className="px-4 py-2 bg-gray-100 text-lg">{quantity}</div>
                <button onClick={() => setQuantity(quantity + 1)} className="flex items-center justify-center rounded-r-md bg-gray-200 px-4 transition hover:bg-green-500 hover:text-white">
                  <Add />
                </button>
              </div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-3xl font-bold text-gray-900">₺{product.price}.00</span>
                <div className="flex space-x-4">
                  <button
                      onClick={addToCartHandler}
                      className="flex items-center px-6 py-3 bg-green-500 text-white text-lg font-semibold rounded-md hover:bg-green-600 transition"
                  >
                    <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                    </svg>
                    Sepete Ekle
                  </button>
                </div>
              </div>
              <div className="border-t ">
                <div className={"grid grid-cols-2"}>

                  <div className="mt-8">
                    <h2 className="text-2xl font-bold">Kapınıza Teslim</h2>
                    <p className="mt-2 text-gray-700">2-3 gün içinde adresinize ücretsiz teslimat yapıyoruz.</p>
                    <h2 className="mt-8 text-2xl font-bold">Müşteri Memnuniyeti</h2>
                    <p className="mt-2 text-gray-700">Düşük fiyat, yüksek kalite sunuyoruz ve ₺100 üzeri siparişlerde
                      ücretsiz teslimat seçeneği sunuyoruz.</p>
                  </div>
                  <div className="mt-8">
                    <h2 className="text-2xl font-bold mb-4">Kiralama Takvimi</h2>
                    <DatePicker
                        selected={null}
                        inline
                        highlightDates={rentedDates}

                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
        <Pdfviewer product={product} isvisible={modal} onClose={() => setModal(false)}/>
      </section>
  );
};

export default SingleProduct;