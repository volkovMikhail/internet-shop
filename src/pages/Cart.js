import React, { useContext, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Header from '../header/Header';
import Footer from '../footer/Footer';
import CartContent from '../cart/CartContent';
import { useSelector, useDispatch } from 'react-redux';
import { AuthContext } from '../AuthContext';
import { clearCart } from '../actions';
import { useAlert } from 'react-alert';
import Modal from 'react-responsive-modal';

function Cart() {
  const store = useSelector((state) => state);
  const [date, setDate] = useState('');
  const [address, setaddress] = useState('');
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const { token, logout } = useContext(AuthContext);
  const [isLodaing, setLoading] = useState(true);
  const history = useHistory();
  const alert = useAlert();
  const [openModal, setOpenModal] = useState(false);
  const [code, setCode] = useState('');
  function total(cart) {
    if (!cart) {
      return 0;
    }
    let total = 0;
    cart.forEach((i) => {
      total += i.price;
    });
    return total;
  }

  async function checkout() {
    if (isLodaing) {
      return;
    }
    setLoading(true);
    const raw = await fetch('/api/checkout', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cart: store.cart, address, date }),
    });
    if (raw.status === 200) {
      const json = await raw.json();
      setCode(json.code);
      setOpenModal(true);
    } else if (raw.status === 400) {
      logout();
      history.push('/login');
    } else {
      alert.error('Что то не так, попробуйте снова');
      setLoading(false);
      return;
    }
    setLoading(false);
    dispatch(clearCart());
  }

  function onDateHandler(e) {
    setDate(e.target.value);
    setButtonState(e.target.value, address);
  }

  function addressHandler(e) {
    setaddress(e.target.value);
    setButtonState(date, e.target.value);
  }

  function setButtonState(dateParam, addressParam) {
    if (addressParam.trim().length > 1 && dateParam && new Date(dateParam)?.getTime() > new Date().getTime()) {
      setLoading(false);
    } else {
      setLoading(true);
    }
  }

  function propareOrder() {
    if (!token) {
      history.push('/login');
      return;
    }
    setShowForm(true);
  }

  const addressStyle =
    address.trim().length > 1
      ? { width: '100%', marginBottom: '1rem' }
      : { width: '100%', marginBottom: '1rem', borderColor: 'salmon' };

  const dateStyle =
    date && new Date(date) > new Date()
      ? { width: '100%', marginBottom: '1rem' }
      : { width: '100%', marginBottom: '1rem', borderColor: 'salmon' };

  return (
    <div>
      <Header active="cart" />
      <h1 className="title">Корзина</h1>
      {store.cart?.length ? <CartContent cart={store.cart} /> : <h1 className="loadingContainer">Корзина пуста</h1>}
      {store.cart?.length ? (
        <div>
          <h1 className="title">Всего: {total(store.cart)} BYN</h1>
          {showForm ? (
            <div
              className="container"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                animation: 'anim 1s forwards',
              }}
            >
              <div
                style={{
                  marginBottom: '1rem',
                  width: '100%',
                  display: 'flex',
                  alignItems: 'flex-end',
                  flexDirection: 'column',
                }}
              >
                <div style={{ maxWidth: '700px', width: '100%' }}>
                  <label htmlFor="order_datetime">Заказать на дату</label>
                  <input
                    className="input"
                    type="date"
                    name="order_datetime"
                    id="order_datetime"
                    style={dateStyle}
                    onChange={onDateHandler}
                  />

                  <label htmlFor="address">Адрес</label>
                  <input
                    className="input"
                    type="text"
                    name="address"
                    id="address"
                    style={addressStyle}
                    onInput={addressHandler}
                  />
                </div>
              </div>
              <button className="logoutBtn" style={{ width: '200px' }} onClick={checkout} disabled={isLodaing}>
                Заказать
              </button>
            </div>
          ) : (
            <div className="container" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                className="logoutBtn"
                style={{ width: '300px' }}
                onClick={() => {
                  propareOrder();
                }}
              >
                Перейти к оформлению
              </button>
            </div>
          )}
        </div>
      ) : null}
      <Modal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
          history.push('/catalog');
        }}
        center
      >
        <h2>Заказ оформлен!</h2>
        <h2>Код вашего заказа: {code}</h2>
        <br />
        <h4>Вам отправлено письмо с чеком на вашу эл. почту</h4>
        <br />
        <h4>подробности заказа можно посмотреть в профиле</h4>
        <br />
        <h3 style={{ color: 'salmon' }}>скоро с вами свяжется менеджер для уточнения деталей заказа</h3>
      </Modal>
      <Footer />
    </div>
  );
}

export default Cart;
