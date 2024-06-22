import React from 'react';

import { Send } from '@mui/icons-material';

const Newsletter = () => {
    return (
        <section className='py-32 px-8 flex flex-col items-center bg-gray-50'>
            <h2 className='font-bold text-5xl sm:text-6xl md:text-7xl mb-10 text-sky-700'>
                İLETİŞİM
            </h2>
            <p className='text-2xl mb-10 text-center w-3/4 font-urbanist text-gray-700'>
                Kitap kiralama projemiz hakkında daha fazla bilgi almak, görüş ve önerilerinizi paylaşmak veya herhangi bir sorunuz varsa, bizimle iletişime geçebilirsiniz. Size yardımcı olmaktan mutluluk duyarız.
            </p>
            <form
                action=''
                className='border-2 border-sky-700 rounded-lg overflow-hidden flex flex-nowrap'
            >
                <input
                    type='email'
                    placeholder='Email adresiniz'
                    className='px-6 py-4 focus:outline-none text-lg w-full'
                />
                <button className='bg-sky-700 px-8 py-4 text-white hover:bg-sky-600 transition duration-300'>
                    <Send />
                </button>
            </form>
        </section>
    );
};

export default Newsletter;