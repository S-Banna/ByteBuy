// @ts-nocheck
'use client';
import { useState } from 'react';
import styles from './page.module.css';

export default function ByteBuy() {

  const laptops = [
    { model: "XPS-15", price: 899.99, cpu: "i5 13th gen", gpu: "RTX 3050", ram: "16GB", storage: "1000GB", storageType: "NVMe", screen: "15.6in", image: "/images/laptop.png" },
    { model: "Inspiron 15", price: 749.99, cpu: "Intel i5-1235U", gpu: "Intel Iris Xe", ram: "8GB", storage: "512GB", storageType: "SSD", screen: "15.6in", image: "/images/laptop.png" },
    { model: "Pavilion Gaming", price: 999.99, cpu: "Ryzen 5 5600H", gpu: "GTX 1650", ram: "16GB", storage: "512GB", storageType: "SSD", screen: "15.6in", image: "/images/laptop.png" },
    { model: "EliteBook 840", price: 1299.99, cpu: "Intel i7-1165G7", gpu: "Intel Iris Xe", ram: "16GB", storage: "512GB", storageType: "SSD", screen: "14in", image: "/images/laptop.png" },
    { model: "Legion 5", price: 1599.99, cpu: "Ryzen 7 5800H", gpu: "RTX 3060", ram: "16GB", storage: "1000GB", storageType: "NVMe", screen: "15.6in", image: "/images/laptop.png" },
    { model: "ThinkPad Carbon", price: 1799.99, cpu: "Intel i7-1260P", gpu: "Intel Iris Xe", ram: "16GB", storage: "1000GB", storageType: "NVMe", screen: "14in", image: "/images/laptop.png" },
    { model: "ROG Strix G15", price: 2199.99, cpu: "Ryzen 9 5900HX", gpu: "RTX 3070", ram: "32GB", storage: "1000GB", storageType: "NVMe", screen: "15.6in", image: "/images/laptop.png" },
    { model: "VivoBook 14", price: 699.99, cpu: "Intel i5-1135G7", gpu: "Intel Iris Xe", ram: "8GB", storage: "512GB", storageType: "SSD", screen: "14in", image: "/images/laptop.png" },
    { model: "Nitro 5", price: 1499.99, cpu: "Intel i7-11800H", gpu: "RTX 3060", ram: "16GB", storage: "1000GB", storageType: "NVMe", screen: "15.6in", image: "/images/laptop.png" },
    { model: "MacBook Air M1", price: 999.99, cpu: "Apple M1", gpu: "Integrated", ram: "8GB", storage: "256GB", storageType: "SSD", screen: "13.3in", image: "/images/laptop.png" }
  ];

  const [darkMode, setDarkMode] = useState(false);
  const [inventory, setInventory] = useState([
    {
      model: "",
      price: 0,
      cpu: "",
      gpu: "",
      ram: "",
      storage: "",
      storageType: "",
      screen: "",
      image: ""
    }
  ].slice(0, 0));
  const [count, setCount] = useState(0);

  const [showLogo, setShowLogo] = useState(true);
  const [showMsg1, setShowMsg1] = useState(false);
  const [showMsg2, setShowMsg2] = useState(false);

  function toggleTheme() {
    setDarkMode(!darkMode);
  }

  function addItem() {
    if (count === laptops.length) return;
    setInventory([...inventory, laptops[count]]);
    setCount(count + 1);
  }

  function deleteItem(index) {
    const updated = inventory.filter((_, i) => i !== index);
    setInventory(updated);
  }

  function clearMain() {
    setShowLogo(false);
    setShowMsg1(true);

    setTimeout(() => {
      setShowMsg2(true);
    }, 2000);
  }

  return (

    <div className={`${styles.page} ${darkMode ? styles.dark : ""}`}>

      <div className={styles.sidebar}>
        <p><span>Inventory</span></p>

        {inventory.map((item, index) => (
          <div className={styles.inventoryItem} key={index}>
            <img src={item.image} />

            <p className={styles.description}>
              Model: {item.model}<br />
              Price: ${item.price}<br />
              CPU: {item.cpu}<br />
              GPU: {item.gpu}<br />
              RAM: {item.ram}<br />
              Storage: {item.storage}<br />
              Storage Type: {item.storageType}<br />
              Screen Size: {item.screen}
            </p>

            <button className={styles.delete} onClick={() => deleteItem(index)}>
              <img src="/images/trash.svg" />
            </button>
          </div>
        ))}
      </div>

      <div className={styles.main}>
        <div className={styles.header}>
          <p className={styles.brand}>
            <a href="#">
              ByteBuy
            </a>
          </p>

          <button className={styles.theme} onClick={toggleTheme}>
            ⏾/☀︎
          </button>
        </div>

        <br />
        <div className={styles.centerContent}>
          {showLogo && (
            <>
              <img src="/images/icon-light.png" />
              <img src="/images/icon-dark.png" />
              <p id="logotext">What do you want to buy?</p>
            </>
          )}

          {showMsg1 && (
            <p className={styles.message}>Hello i need a gaming laptop.</p>
          )}

          {showMsg2 && (
            <p className={styles.message}>
              Sure! Here are some suggestions:
              <button className={styles.add} onClick={addItem}>+ add suggestion</button>
            </p>
          )}
        </div>
      </div>

      <div className={styles.inputArea}>
        <input placeholder="Ask anything..." id="textbox" />

        <div className={styles.send}>
          <img src="/images/send_dark.svg" onClick={clearMain} />
          <img src="/images/send_light.svg" onClick={clearMain} />
        </div>
      </div>
    </div>
  );
}