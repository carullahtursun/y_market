import React, { useState } from 'react';

import { useParams } from 'react-router-dom';

import Announcement from '../layout/Announcement';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';
import Products from '../components/Products';
import Newsletter from '../components/Newsletter';
import Title from '../components/Title';
import Filter from '../components/Filter'

const ShoppingCategory = () => {
    const [title, setTitle] = useState('');
    const [category, setCategory] = useState('');

    return (
        <>
            <Filter setTitle={setTitle} setCategory={setCategory} category={category} />
            <Products category={category} title={title} />
            <Newsletter />
        </>
    );
};

export default ShoppingCategory;