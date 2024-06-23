import React, { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useSelector, useDispatch } from 'react-redux';
import StripeCheckout from 'react-stripe-checkout';
import { useHistory } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import CartProduct from '../components/CartProduct';

import { removeFromCart, decreaseCart, addToCart, getTotals, clearCart } from '../store/cart-slice';
import OrderSuccessModal from '../components/Admin/OrderSuccessModal';

import 'mapbox-gl/dist/mapbox-gl.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const ShoppingCart = () => {
  const cart = useSelector((store) => store?.cart);
  const dispatch = useDispatch();
  const history = useHistory();
  const { token } = useSelector((state) => state.auth);
  const userId = useSelector((store) => store.auth.currentUser._id);
  const [onClose, setOnClose] = useState(false);

  const [formState, setFormState] = useState({
    userId: userId,
    products: cart?.cartItems,
    amount: cart?.totalPrice,
    totalQuantity: cart?.totalQuantity,
    address: {
      street: '',
      city: '',
      country: 'Turkey'
    },
    status: 'Bekleniyor',
    deliveryCode: '',
    startDate: null,
    endDate: null,
  });
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    calculateTotalPrice();
  }, [startDate, endDate]);

  const calculateTotalPrice = () => {
    if (startDate && endDate) {
      const oneDay = 24 * 60 * 60 * 1000;
      const diffDays = Math.round(Math.abs((endDate - startDate) / oneDay));
      const weeks = Math.ceil(diffDays / 7);
      const newTotalPrice = cart.cartItems.reduce((acc, item) => acc + item.price * weeks, 0);
      setFormState({
        ...formState,
        amount: newTotalPrice,
        startDate: startDate,
        endDate: endDate
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormState({
      ...formState,
      address: {
        ...formState.address,
        [name]: value,
      },
    });
  };

  const handleOrder = (event) => {
    event.preventDefault();
    if (!startDate || !endDate) {
      toast.error('Lütfen kiralama tarihlerini seçin.');
      return;
    }
    if (!formState.address.street || !formState.address.city) {
      toast.error('Lütfen adres bilgilerini doldurun.');
      return;
    }
    createOrder();
  };

  const createOrder = async () => {
    console.log("formState",formState)
    try {
      const response = await axios.post(
          `http://localhost:5000/api/orders`,
          formState,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              id: userId
            }
          }
      );
      toast.success('Sipariş başarıyla oluşturuldu!');
      dispatch(clearCart());
      setIsOpen(true);
      return response.data;
    } catch (error) {
      toast.error('Sipariş oluşturulurken bir hata oluştu');
      throw error;
    }
  };

  const continueShoppingClickHandler = () => {
    history.goBack();
  };

  const { data: users, isLoading } = useQuery(['users'], async () => {
    const response = await axios.get('http://localhost:5000/api/users', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    return response.data;
  });

  const adminUsers = users?.filter(user => user.isAdmin === true) ?? [];

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
      <>
        <OrderSuccessModal isOpen={isOpen} setIsOpen={setIsOpen} />
        <section className='px-8 py-4'>
          <h1 className='uppercase mt-4 mb-8 text-4xl text-center'>SEPETINIZ</h1>
          <div className='grid sm:grid-cols-3 gap-4 md:gap-6 lg:gap-8'>
            <div>
              <a
                  onClick={continueShoppingClickHandler}
                  className='text-sm lg:text-md cursor-pointer uppercase block p-4 border-2 rounded-lg  hover:bg-sky-500 hover:text-white transition ease-out duration-500'
              >
                Alışverişe Devam Et
              </a>
            </div>
            <div className='flex justify-between items-center'>
              <p className='mr-4 cursor-pointer'>
                Sepet ({cart?.totalQuantity})
              </p>
            </div>
          </div>
          <div className='my-12 grid gap-8 lg:grid-cols-[2fr_1fr]'>
            <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
              <table className="w-full text-sm text-left text-black dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase ">
                <tr>
                  <th scope="col" className="text-start py-3 px-6">
                    <span className="sr-only">Fotoğraf</span>
                  </th>
                  <th scope="col" className=" text-start py-3 px-6">
                    Ürün
                  </th>
                  <th scope="col" className=" text-start py-3 px-6">
                    Adet
                  </th>
                  <th scope="col" className=" text-start py-3 px-6">
                    Fiyat
                  </th>
                  <th scope="col" className=" text-start py-3 px-6">
                    Ürünü Çıkar
                  </th>
                </tr>
                </thead>
                <tbody>
                {cart && cart.cartItems?.map((product) => (
                    <CartProduct key={product._id} product={product} />
                ))}
                </tbody>
              </table>
            </div>

            <div>
              <div className='border rounded-xl p-4 bg-white shadow-lg'>
                <h2 className='uppercase text-3xl mb-4'>Teslimat Bilgileri</h2>
                <div className={"flex justify-between"}>

                <div className='mb-8'>
                  <label className='block mb-2 font-medium'>Başlangıç Tarihi:</label>
                  <DatePicker
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      className="block w-full bg-white border-2 border-gray-300 px-4 py-2 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500"
                      dateFormat="dd/MM/yyyy"
                  />
                </div>
                <div className='mb-8'>
                  <label className='block mb-2 font-medium'>Bitiş Tarihi:</label>
                  <DatePicker
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      className="block w-full bg-white border-2 border-gray-300 px-4 py-2 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500"
                      dateFormat="dd/MM/yyyy"
                  />
                </div>
                </div>
                <div className='mb-8'>
                  <label className='block mb-2 font-medium'>Tam Adres:</label>
                  <input
                      type='text'
                      name='street'
                      value={formState.address.street}
                      onChange={handleInputChange}
                      className="block w-full bg-white border-2 border-gray-300 px-4 py-2 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500"
                      placeholder='Sokak Adresi'
                  />
                </div>
                <div className='mb-8'>
                  <label className='block mb-2 font-medium'>Şehir:</label>
                  <input
                      type='text'
                      name='city'
                      value={formState.address.city}
                      onChange={handleInputChange}
                      className="block w-full bg-white border-2 border-gray-300 px-4 py-2 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500"
                      placeholder='Şehir'
                  />
                </div>
                <div className='mb-8'>
                  <label className='block mb-2 font-medium'>Ülke:</label>
                  <input
                      type='text'
                      name='country'
                      value={formState.address.country}
                      onChange={handleInputChange}
                      className="block w-full bg-white border-2 border-gray-300 px-4 py-2 rounded-lg shadow leading-tight focus:outline-none focus:shadow-outline focus:border-sky-500"
                      placeholder='Ülke'
                      disabled
                  />
                </div>
              </div>
              <div className='mt-4'>
                <div className='border rounded-xl p-4'>
                  <h1 className='uppercase text-4xl mb-8'>SİPARİŞ ÖZETİ</h1>
                  <div className='flex justify-between mb-8'>
                    <span className='capitalize'>Toplam</span>
                    <span>₺ {formState.amount}</span>
                  </div>
                  <div className='flex justify-between mb-8'>
                    <span className='capitalize'>KDV</span>
                    <span>₺ 00.00</span>
                  </div>
                  <div className='flex justify-between mb-8'>
                    <span className='capitalize'>İndirim</span>
                    <span>-₺ 00.00</span>
                  </div>
                  <div className='flex justify-between mb-8'>
                    <span className='capitalize font-bold text-2xl'>Toplam</span>
                    <span className='font-bold text-2xl'>₺ {formState.amount}</span>
                  </div>
                </div>
                <div className='mt-2'>
                  <a
                      onClick={handleOrder}
                      className='text-sm lg:text-md cursor-pointer text-center uppercase block p-4 border-2 hover:text-black hover:border-black hover:bg-white bg-sky-500 rounded-lg text-white transition ease-out duration-500'>
                    {createOrder.isLoading ? "Yükleniyor..." : "Sipariş Ver"}
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
  );
};

export default ShoppingCart;