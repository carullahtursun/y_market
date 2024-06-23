import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ArrowLeft, ArrowRight } from '@mui/icons-material';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { useQuery } from '@tanstack/react-query';
import SearchIcon from '@mui/icons-material/Search';
import SearchDropdown from './SearchDropdown';
const CAROUSEL_DATA = [
    {
        url: 'https://images.pexels.com/photos/694740/pexels-photo-694740.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
    },
    {
        url: 'https://images.pexels.com/photos/261821/pexels-photo-261821.jpeg?cs=srgb&dl=pexels-pixabay-261821.jpg&fm=jpg',
    },
];

const Carousel = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');

    const incrementIndex = () => {
        setCurrentIndex((currentIndex + 1) % CAROUSEL_DATA.length);
    };

    const decrementIndex = () => {
        setCurrentIndex(currentIndex === 0 ? CAROUSEL_DATA.length - 1 : currentIndex - 1);
    };

    return (
        <section className="relative h-carousel bg-sky-300">
            <img
                src={CAROUSEL_DATA[currentIndex].url}
                alt="Carousel Slide"
                className="w-full h-full object-cover"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-black/30" />
            <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-center items-center text-white uppercase px-4 text-center">
                <h1 className="text-4xl md:text-6xl font-bold mb-8">
                    Kitaplarımızda yaşanmışlık var...
                </h1>
                <Formik initialValues={{ search: '' }} onSubmit={() => { }}>
                    <Form className="relative w-full max-w-md">
                        <div className="relative w-full">
                            <input
                                type="text"
                                name="search"
                                className="block w-full p-4 pl-12 pr-20 text-md bg-white text-black rounded-lg shadow-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                                placeholder="Search for title..."
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                            <SearchIcon className="absolute top-1/2 left-4 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            {searchQuery.length > 0 && <SearchDropdown searchQuery={searchQuery} />}

                        </div>
                    </Form>
                </Formik>
            </div>
        </section>
    );
};

export default Carousel;