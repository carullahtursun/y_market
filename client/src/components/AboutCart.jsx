import React from 'react'
import SearchIcon from '@mui/icons-material/Search';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DeleteSweepOutlinedIcon from '@mui/icons-material/DeleteSweepOutlined';
import { FaCreativeCommons } from "react-icons/fa";
import { MdEventAvailable } from "react-icons/md";
function AboutCard() {
    return (
        <>
            <div className="h-fit w-full py-14 shadow-lg">
                <div className="flex flex-wrap items-center">
                    <div className="w-10/12 md:w-6/12 lg:w-4/12 px-12 md:px-4 mr-auto ml-auto -mt-78">
                        <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded-lg bg-sky-500">
                            <img
                                alt="..."
                                src="https://images.pexels.com/photos/2041540/pexels-photo-2041540.jpeg?cs=srgb&dl=pexels-rafael-cosquiere-2041540.jpg&fm=jpghttps://images.pexels.com/photos/5632402/pexels-photo-5632402.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                                className="w-full align-middle rounded-t-lg"
                            />
                            <blockquote className="relative p-8 mb-4">
                                <h4 className="text-xl font-bold text-white">
                                    Öğrenci Dostu Kitap Kiralama Projesi
                                </h4>
                                <p className="text-md font-light mt-2 text-white">
                                    Kitap Kiralama Projesi, öğrencilerin kitaplara erişimini kolaylaştırmak ve maliyetlerini düşürmek amacıyla tasarlanmıştır. Bu proje, öğrencilerin istedikleri kitapları kiralamasına olanak tanır.
                                </p>
                            </blockquote>
                        </div>
                    </div>

                    <div className="w-full md:w-6/12 px-4">
                        <div className="flex flex-wrap">
                            <div className="w-full md:w-6/12 px-4">
                                <div className="relative flex flex-col mt-4">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                                            <SearchIcon />
                                        </div>
                                        <h6 className="text-xl mb-1 font-semibold">Hızlı ve Kolay Erişim</h6>
                                        <p className="mb-4 text-blueGray-500">
                                            İstediğiniz kitaplara anında ulaşın.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative flex flex-col min-w-0">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                                            <AttachMoneyIcon />
                                        </div>
                                        <h6 className="text-xl mb-1 font-semibold">
                                            Ekonomik Çözüm
                                        </h6>
                                        <p className="mb-4 text-blueGray-500">
                                            Kitap maliyetlerini düşürün.
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <div className="w-full md:w-6/12 px-4">
                                <div className="relative flex flex-col min-w-0 mt-4">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                                            <MdEventAvailable />
                                        </div>
                                        <h6 className="text-xl mb-1 font-semibold">Esnek Kiralama Süreleri</h6>
                                        <p className="mb-4 text-blueGray-500">
                                            Kitapları ihtiyacınıza göre kiralayın.
                                        </p>
                                    </div>
                                </div>
                                <div className="relative flex flex-col min-w-0">
                                    <div className="px-4 py-5 flex-auto">
                                        <div className="text-blueGray-500 p-3 text-center inline-flex items-center justify-center w-12 h-12 mb-5 shadow-lg rounded-full bg-white">
                                            <FaCreativeCommons />
                                        </div>
                                        <h6 className="text-xl mb-1 font-semibold">Çevre Dostu</h6>
                                        <p className="mb-4 text-blueGray-500">
                                            Sürdürülebilir kitap kullanımı ile çevreyi koruyun.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <footer className="relative bg-blueGray-50 pt-8 pb-6 mt-2">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-wrap items-center md:justify-between justify-center">
                            <div className="w-full md:w-6/12 px-4 mx-auto text-center">
                                <div className="text-sm text-blueGray-500 font-semibold py-1">
                                    Kitap Kiralama Platformu © 2024
                                </div>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

export default AboutCard;