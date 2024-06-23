import { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import ShoppingCategory from './pages/ShoppingCategory';
import SingleProduct from './pages/SingleProduct';
import ShoppingCart from './pages/ShoppingCart';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import { useLocation } from 'react-router-dom';
import AdminProducts from './components/Admin/AdminProducts';




import { ToastContainer } from 'react-toastify';
import Loading from './components/Loading';
import 'react-toastify/dist/ReactToastify.css';
import AdminOrder from './components/Admin/AdminOrder';
import AdminOrderDetail from './components/Admin/AdminOrderDetail';
import AdminSidebar from './layout/AdminSidebar';

import About from './pages/About';
import Contact from './pages/Contact';
import Announcement from './layout/Announcement';
import Navbar from './layout/Navbar';
import Footer from './layout/Footer';
import AdminCategories from "./components/Admin/AdminCategories.jsx";

const App = () => {


  let location = useLocation();

  useEffect(() => { }, [location]);

  console.log(location);
  const user = useSelector((store) => store.auth.currentUser);

  const [isLoading, setIsLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false)
  useEffect(() => {
    // Verilerin yüklenmesi gibi bir işlem yapıyorsanız setIsLoading(false) şeklinde değiştirin.
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  console.log(user);
  return (
    <>
      <div className='h-full'>
        <ToastContainer />

        {isLoading ? (
          <Loading />
        ) : (
          <>
            {!location.pathname.includes("admin") && (
              <>
                <Announcement />
                <Navbar />
              </>
            )}
            <Switch>
              <Route exact path='/'>
                <Home />
              </Route>
              <Route path='/categories/:category'>
                <ShoppingCategory />
              </Route>
              <Route path='/products/:id'>
                <SingleProduct />
              </Route>
              <Route path='/about'>
                <About />
              </Route>
              <Route path='/contact'>
                <Contact />
              </Route>
              <Route path='/cart'>
                <ShoppingCart />
              </Route>
              <Route path='/login'>
                <Login />
                {user && <Redirect to='/' />}
              </Route>
              <Route path='/signup'>{user ? <Redirect to='/' /> : <Signup />}</Route>
              {
                user &&
                <Route path='/profile'>
                  <Profile />
                </Route>}
              {user?.isAdmin && (
                <>

                  {
                    user.isAdmin ? (

                      <>
                        <Route exact path='/admin'>
                          <section className=" flex  w-full  ">
                            <AdminSidebar />
                            <div className='w-full  px-6 h-screen overflow-hidden '>
                              <Admin />
                            </div>
                          </section>

                        </Route>
                        <Route path='/admin/product'>
                          <section className=" flex  w-full  ">
                            <AdminSidebar />
                            <div className='w-full  px-6 h-screen overflow-hidden '>
                              <AdminProducts />
                            </div>
                          </section>

                        </Route>
                        <Route path='/admin/categories'>
                          <section className=" flex  w-full  ">
                            <AdminSidebar />
                            <div className='w-full  px-6 h-screen overflow-hidden '>
                              <AdminCategories />
                            </div>
                          </section>

                        </Route>
                        <Route path='/admin/order'>
                          <section className=" flex  w-full  ">
                            <AdminSidebar />
                            <div className='w-full  px-6 h-screen overflow-hidden '>
                              <AdminOrder setIsOpen={setIsOpen} />
                            </div>
                          </section>

                        </Route>
                        <Route path='/admin/order/:id'>
                          <section className=" flex  w-full  ">
                            <AdminSidebar />
                            <div className='w-full  px-6 h-screen overflow-hidden '>
                              <AdminOrderDetail isOpen={isOpen} setIsOpen={setIsOpen} />
                            </div>
                          </section>

                        </Route>

                      </>

                    ) : (
                      <Redirect to='/' />
                    )
                  }
                </>
              )}
              {!user && (
                <>
                  <Redirect to='/login' />
                </>
              )}
            </Switch>
            {!location.pathname.includes("admin") && <Footer />}
          </>
        )}
        <ToastContainer />
      </div>
    </>
  );
};

export default App;