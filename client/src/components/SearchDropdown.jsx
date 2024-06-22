
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Link } from 'react-router-dom';
const SearchDropdown = ({ searchQuery }) => {
    const { data, isLoading, error } = useQuery(
        ['search', searchQuery],
        () =>
            axios
                .get(`http://localhost:5000/api/products?title=${searchQuery}`)
                .then((res) => res.data),
        {
            enabled: searchQuery.length > 0,
        }
    );

    if (isLoading) return <div className="absolute w-full bg-white p-4 text-center rounded-b-lg shadow-lg">Loading...</div>;

    if (error) return <div className="absolute w-full bg-white p-4 text-center rounded-b-lg shadow-lg">Error: {error.message}</div>;

    return (
        <div className="absolute w-full max-h-80 overflow-y-scroll z-10 bg-white border border-gray-200 rounded-b-lg shadow-lg">
            {data.map((product) => (
                <Link key={product._id} to={`/products/${product._id}`} className="block hover:bg-gray-100">
                    <div className="flex items-center p-4">
                        <img className="w-12 h-12 object-cover rounded mr-4" src={product.image} alt={product.title} />
                        <div className="flex-1">
                            <p className="text-gray-900 font-semibold">{product.title}</p>
                            <p className="text-gray-700">₺{product.price}.00</p>
                        </div>
                    </div>
                </Link>
            ))}
        </div>
    );
};

export default SearchDropdown;