import React from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import Product from './Product';

const fetchUserProducts = async (userId) => {
  const response = await axios.get(`http://localhost:5000/api/products?likedBy=${userId}`);
  return response.data;
};

const LikeProduct = ({ userID }) => {
  const { data: products, isLoading, isError } = useQuery(['likedProduct', userID], () => fetchUserProducts(userID));

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error loading user products</div>;
  }

  return (
      <div>
        <section className='pb-8 mx-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4'>
          {products.map((userProduct) => (
              <Product key={userProduct._id} product={userProduct} />
          ))}
        </section>
      </div>
  );
};

export default LikeProduct;