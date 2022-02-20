import React, { useState } from 'react';
import styles from './itemcontent.module.css';
import ModalToCart from '../modalSizesToCart/ModalToCart';

function ItemContent({ wear }) {
  const [open, setOpen] = useState(false);

  function addItemToCart(itemId, size) {
    setOpen(true);
  }

  return (
    <main>
      <div className={styles.container}>
        <div className={styles.imagesContainer}>
          {wear?.images !== undefined ? (
            wear.images.map((i, index) => <div key={index} style={{ backgroundImage: `url('${i}')` }}></div>)
          ) : (
            <h1>Загрузка...</h1>
          )}
        </div>
        <div className={styles.infoContainer}>
          <div className={styles.title}>
            <h1>{wear.title}</h1>
          </div>
          <div className={styles.discription}>
            <p>{wear.discription}</p>
          </div>
          <div className={styles.sizes}>
            <div>Размеры:</div>
            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
              {wear.sizes.map((s, i) => (
                <div className={styles.sizesItem} key={i}>
                  {s}
                </div>
              ))}
            </div>
          </div>
          <div className={styles.category}>
            <p>Категория: {wear.category}</p>
          </div>
          <div className={styles.price}>
            <p>
              {wear.price} {wear.currency}
            </p>
          </div>
          <button
            className={styles.orderButton + ' ' + styles.category}
            onClick={() => {
              addItemToCart(wear._id, 'SIZE');
            }}
          >
            Добавить в корзину
          </button>
          <div>
            <p>Количество товара на складе: {wear.quantity}</p>
          </div>
        </div>
      </div>
      <ModalToCart
        open={open}
        close={() => {
          setOpen(false);
        }}
        wear={wear}
      />
    </main>
  );
}

export default ItemContent;
