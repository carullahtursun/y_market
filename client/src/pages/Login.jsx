import { useFormik } from "formik";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as Yup from "yup";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch } from "react-redux";
import { loginSuccess, loginFailure } from "../store/auth-slice";
import { Link } from "react-router-dom";
import axios from "axios";
const LoginSchema = Yup.object().shape({
  username: Yup.string().required("Kullanıcı adı zorunludur"),
  password: Yup.string().required("Şifre zorunludur"),
});

const Login = () => {
  const queryClient = useQueryClient();
  const dispatch = useDispatch();

  const mutation = useMutation(
      (values) => axios.post("http://localhost:5000/api/auth/login", values),
      {
        onSuccess: (data, variables) => {
          toast.success("Başarıyla giriş yaptınız");
          queryClient.invalidateQueries("user");
          dispatch(loginSuccess({ user: data.data.user, token: data.data.token }));
        },
        onError: () => {
          toast.error("Bir hata oluştu, lütfen daha sonra tekrar deneyin");
        },
      }
  );

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values) => {
      try {
        await mutation.mutate(values);
      } catch (err) {
        toast.error("Bir hata oluştu, lütfen daha sonra tekrar deneyin");
      }
    },
  });

  return (
      <>
        <div className="bg-no-repeat bg-cover bg-center relative bg-[url('https://images.pexels.com/photos/1340588/pexels-photo-1340588.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1')]">
          <div className="grid md:absolute xl:absolute bg-gradient-to-b from-gray-800 to-gray-200 opacity-10 inset-0 z-0"></div>
          <div className="min-h-screen sm:flex sm:flex-row mx-0 justify-center">
            <div className="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
              <div className="self-start hidden lg:flex flex-col text-white">
                <h1 className="mb-3 font-bold text-5xl">Hoşgeldiniz <span className="text-sky-500">Kitap Kiralama</span> </h1>
                <p className="pr-3">Kitap kiralama platformumuza hoş geldiniz. Kullanıcı adınızla giriş yaparak kitap kiralamaya başlayabilirsiniz.</p>
              </div>
            </div>
            <div className="flex justify-center self-center z-10">
              <div className="p-16 bg-white mx-auto rounded-2xl w-100">
                <div className="mb-4">
                  <h3 className="font-semibold text-2xl text-gray-800">Giriş Yap</h3>
                  <p className="text-gray-500">Lütfen kullanıcı adınız ile giriş yapınız</p>
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
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                          id="remember_me"
                          name="remember_me"
                          type="checkbox"
                          className="h-4 w-4 bg-blue-500 focus:ring-blue-400 border-gray-300 rounded"
                      />
                      <label htmlFor="remember_me" className="ml-2 block text-sm text-gray-800">
                        Beni hatırla
                      </label>
                    </div>
                    <div className="text-sm">
                      <a href="#" className="text-sky-400 hover:text-sky-500">
                        Şifrenizi mi unuttunuz?
                      </a>
                    </div>
                  </div>
                  <div>
                    <button
                        type="submit"
                        className="mb-4 w-full flex justify-center bg-sky-400 hover:bg-sky-500 text-gray-100 p-3 rounded-full tracking-wide shadow-lg cursor-pointer transition ease-in duration-500"
                        disabled={formik.isSubmitting || mutation.isLoading}
                    >
                      {mutation.isLoading ? "Giriş yapılıyor..." : "Giriş Yap"}
                    </button>
                  </div>
                  {mutation.isError && <p>Bir hata oluştu. Lütfen daha sonra tekrar deneyin...</p>}
                  <Link to="/signup" className="capitalize underline px-8 mt-3 text-center w-full">
                    Kayıtlı bir kullanıcı adınız yok mu?
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

export default Login;