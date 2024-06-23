import React from 'react';

const OrderSuccessModal = ({ isOpen, onClose,setIsOpen }) => {
    return (
        <div
            className={`${isOpen ? 'fixed' : 'hidden'
                } top-0 left-0 w-full h-full bg-gray-900 z-50 bg-opacity-50 flex justify-center items-center`}
        >
            <div className="bg-white rounded-lg shadow-lg p-6 mx-4">
                <div className='flex flex-col items-center justify-center w-full'>

                    <h2 className="text-2xl font-bold mb-4">Sipariş Başarılı!</h2>
                    <img src="/blob.svg" alt="Order Success" className="mb-4 w-72" />
                    <p className="mb-4 w-1/2 text-center font-urbanist">
                        Siparişiniz için teşekkür ederiz. İşletmenizi takdir ediyoruz ve gelecekte size tekrar hizmet vermeyi sabırsızlıkla bekliyoruz.
                    </p>
                    <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                        onClick={()=> setIsOpen(false)}
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderSuccessModal;
