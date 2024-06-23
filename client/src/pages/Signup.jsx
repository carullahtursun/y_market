import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useFormik } from "formik";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useEffect, useState } from "react";
import * as Yup from "yup";

const SignupSchema = Yup.object().shape({
  username: Yup.string().required("Kullanıcı adı zorunludur"),
  email: Yup.string().email("Geçerli bir email adresi giriniz").required("Email zorunludur"),
  password: Yup.string().required("Şifre zorunludur"),
});

const Signup = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const [locationError, setLocationError] = useState(false);

  const mutation = useMutation(
      (userData) => axios.post("http://localhost:5000/api/auth/register", userData),
      {
        onSuccess: () => {
          toast.success("Hesap başarıyla oluşturuldu!");
          history.push("/login");
        },
        onError: () => {
          toast.error("Hesap oluşturulurken bir hata oluştu.");
        },
      }
  );

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      address: { lat: '', lng: '' }
    },
    validationSchema: SignupSchema,
    onSubmit: (values) => {
      if (!locationError) {
        mutation.mutate(values);
      } else {
        toast.error("Konum bilgisi alınamadı. Form gönderilemez.");
      }
    },
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            formik.setValues({
              ...formik.values,
              address: {
                lat: latitude,
                lng: longitude
              }
            });
          },
          (error) => {
            console.log(error);
            setLocationError(true);
          }
      );
    } else {
      console.log('Tarayıcınız konum bilgisini desteklemiyor.');
      setLocationError(true);
    }
  }, []);

  return (
      <>
        <div className="bg-no-repeat bg-cover bg-center relative bg-[url('https://images.pexels.com/photos/415071/pexels-photo-415071.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]">
          <div className="grid md:absolute xl:absolute bg-gradient-to-b from-gray-800 to-gray-200 opacity-50 inset-0 z-0"></div>
          <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
            <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
              <div className="self-start hidden lg:flex flex-col text-white">
                <h1 className="mb-3 font-bold text-5xl">Kitap Kiralama Platformuna Hoşgeldiniz</h1>
                <p className="pr-3">Kullanıcı adınız ile kayıt olarak kitap kiralamaya başlayabilirsiniz.</p>
              </div>
            </div>
            <div className="flex justify-center self-center z-10">
              <div className="p-16 bg-white mx-auto rounded-2xl w-100">
                <div className="mb-4">
                  <h3 className="font-semibold text-2xl text-gray-800">Kayıt Ol</h3>
                  <p className="text-gray-500">Lütfen bilgilerinizi giriniz</p>
                </div>

                <form onSubmit={formik.handleSubmit} className="space-y-5">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 tracking-wide">Kullanıcı Adı</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        placeholder="Kullanıcı Adı"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        className="w-full text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-400"
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <div className="text-red-500 mb-4">{formik.errors.username}</div>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Email"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.email}
                        className="w-full content-center text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-400"
                    />
                    {formik.touched.email && formik.errors.email ? (
                        <div className="text-red-500 mb-4">{formik.errors.email}</div>
                    ) : null}
                  </div>

                  <div className="space-y-2">
                    <label className="mb-5 text-sm font-medium text-gray-700 tracking-wide">Şifre</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        placeholder="Şifre"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className="w-full content-center text-base px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-sky-400"
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 mb-4">{formik.errors.password}</div>
                    ) : null}
                  </div>

                  <div>
                    <button
                        type="submit"
                        className="w-full mb-4 flex justify-center bg-sky-400 hover:bg-sky-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                        disabled={formik.isSubmitting || mutation.isLoading}
                    >
                      {mutation.isLoading ? "Yükleniyor..." : "Hesap Oluştur"}
                    </button>
                  </div>
                  {mutation.isError && <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyin...</p>}
                  <Link to="/login" className="px-12 underline mb-4">
                    Zaten Bir Hesabınız var mı?
                  </Link>
                </form>
                <div className="pt-5 text-center text-gray-400 text-xs">
                <span>
                  Kitap Kiralama © 2023-2024
                </span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer />
      </>
  );
};

export default Signup;