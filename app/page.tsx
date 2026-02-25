"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

const laptops = [
  {
    model: "XPS-15",
    price: 899.99,
    cpu: "i5 13th gen",
    gpu: "RTX 3050",
    ram: "16GB",
    storage: "1000GB",
    storageType: "NVMe",
    screen: "15.6in",
    image: "images/laptop.png",
  },
  {
    model: "Inspiron 15",
    price: 749.99,
    cpu: "Intel i5-1235U",
    gpu: "Intel Iris Xe",
    ram: "8GB",
    storage: "512GB",
    storageType: "SSD",
    screen: "15.6in",
    image: "images/laptop.png",
  },
  {
    model: "Pavilion Gaming",
    price: 999.99,
    cpu: "Ryzen 5 5600H",
    gpu: "GTX 1650",
    ram: "16GB",
    storage: "512GB",
    storageType: "SSD",
    screen: "15.6in",
    image: "images/laptop.png",
  },
  {
    model: "EliteBook 840",
    price: 1299.99,
    cpu: "Intel i7-1165G7",
    gpu: "Intel Iris Xe",
    ram: "16GB",
    storage: "512GB",
    storageType: "SSD",
    screen: "14in",
    image: "images/laptop.png",
  },
  {
    model: "Legion 5",
    price: 1599.99,
    cpu: "Ryzen 7 5800H",
    gpu: "RTX 3060",
    ram: "16GB",
    storage: "1000GB",
    storageType: "NVMe",
    screen: "15.6in",
    image: "images/laptop.png",
  },
  {
    model: "ThinkPad Carbon",
    price: 1799.99,
    cpu: "Intel i7-1260P",
    gpu: "Intel Iris Xe",
    ram: "16GB",
    storage: "1000GB",
    storageType: "NVMe",
    screen: "14in",
    image: "images/laptop.png",
  },
  {
    model: "ROG Strix G15",
    price: 2199.99,
    cpu: "Ryzen 9 5900HX",
    gpu: "RTX 3070",
    ram: "32GB",
    storage: "1000GB",
    storageType: "NVMe",
    screen: "15.6in",
    image: "images/laptop.png",
  },
  {
    model: "VivoBook 14",
    price: 699.99,
    cpu: "Intel i5-1135G7",
    gpu: "Intel Iris Xe",
    ram: "8GB",
    storage: "512GB",
    storageType: "SSD",
    screen: "14in",
    image: "images/laptop.png",
  },
  {
    model: "Nitro 5",
    price: 1499.99,
    cpu: "Intel i7-11800H",
    gpu: "RTX 3060",
    ram: "16GB",
    storage: "1000GB",
    storageType: "NVMe",
    screen: "15.6in",
    image: "images/laptop.png",
  },
  {
    model: "MacBook Air M1",
    price: 999.99,
    cpu: "Apple M1",
    gpu: "Integrated",
    ram: "8GB",
    storage: "256GB",
    storageType: "SSD",
    screen: "13.3in",
    image: "images/laptop.png",
  },
];

interface InventoryItem {
  id: string;
  laptopIndex: number;
}

export default function Page() {
  const [theme, setTheme] = useState<"dark" | "light">("dark");
  const [count, setCount] = useState(0);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [showMain, setShowMain] = useState(false);
  const [showMessage1, setShowMessage1] = useState(false);
  const [showMessage2, setShowMessage2] = useState(false);
  const [message1Raised, setMessage1Raised] = useState(false);
  const [textboxValue, setTextboxValue] = useState("");
  const countRef = useRef(count);
  countRef.current = count;

  function toggleTheme() {
    setTheme((prev) => (prev === "dark" ? "light" : "dark"));
  }

  function add() {
    if (countRef.current >= laptops.length) return;
    const currentCount = countRef.current;
    setInventory((prev) => [
      ...prev,
      { id: "item-" + currentCount, laptopIndex: currentCount },
    ]);
    setCount((prev) => prev + 1);
  }

  function deleteItem(id: string) {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  }

  function sleep(ms: number) {
    return new Promise<void>((resolve) => setTimeout(resolve, ms));
  }

  async function clearMain() {
    setShowMain(true);
    setShowMessage1(true);
    setShowMessage2(false);
    setMessage1Raised(false);
    setTextboxValue("");
    await sleep(2000);
    setMessage1Raised(true);
    setShowMessage2(true);
  }

  return (
    <>
      <style>{`
        body { margin: 0; font-family: sans-serif; background-color: ${theme === "dark" ? "rgb(33,33,33)" : "rgb(255,255,255)"}; }
        ::-webkit-scrollbar { display: none; }
      `}</style>
      <div className={`${styles.page} ${styles[theme]}`}>
        <div className={styles.side}>
          <p className={styles.inv}>
            <span className={styles.invSpan}>Inventory</span>
          </p>
          {inventory.map((item) => {
            const laptop = laptops[item.laptopIndex];
            return (
              <div key={item.id} id={item.id} className={styles.inventoryItem}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  className={styles.laptopImage}
                  src="images/laptop.png"
                  alt="laptop"
                />
                <p className={styles.description}>
                  Model: {laptop.model}
                  <br />
                  Price: ${laptop.price}
                  <br />
                  CPU: {laptop.cpu}
                  <br />
                  GPU: {laptop.gpu}
                  <br />
                  RAM: {laptop.ram}
                  <br />
                  Storage: {laptop.storage}
                  <br />
                  Storage Type: {laptop.storageType}
                  <br />
                  Screen Size: {laptop.screen}
                </p>
                <button
                  className={styles.delete}
                  onClick={() => deleteItem(item.id)}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    className={styles.trash}
                    src="images/trash.svg"
                    alt="delete"
                  />
                </button>
              </div>
            );
          })}
        </div>

        <div className={styles.main}>
          <div className={styles.darkmode}>
            <p className={styles.ByteBuy}>
              <a className={styles.link} href="#">
                ByteBuy
              </a>
            </p>
            <button className={styles.themeBtn} onClick={toggleTheme}>
              ⏾/☀︎
            </button>
          </div>
          <br />

          {!showMain && (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="light"
                src="images/icon-light.png"
                alt="icon"
                style={{
                  display: theme === "light" ? "block" : "none",
                  width: 100,
                  margin: "auto",
                }}
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                id="dark"
                src="images/icon-dark.png"
                alt="icon"
                style={{
                  display: theme === "dark" ? "block" : "none",
                  width: 100,
                  margin: "auto",
                }}
              />
              <p className={styles.logotext}>What do you need help with?</p>
            </>
          )}

          {showMessage1 && (
            <p
              className={styles.message1}
              style={{ bottom: message1Raised ? "30%" : "12%" }}
            >
              Hello i need a gaming laptop.
            </p>
          )}

          {showMessage2 && (
            <p className={styles.message2}>
              Sure! Here are some suggestions:
              <button className={styles.add} onClick={add}>
                + add suggestion
              </button>
            </p>
          )}
        </div>

        <div className={styles.text}>
          <input
            placeholder="Ask anything..."
            id="textbox"
            className={styles.textbox}
            value={textboxValue}
            onChange={(e) => setTextboxValue(e.target.value)}
          />
          <div className={styles.send}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              onClick={clearMain}
              className={styles.send_dark}
              src="images/send_dark.svg"
              alt="send"
              style={{ display: theme === "dark" ? "block" : "none" }}
            />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              onClick={clearMain}
              className={styles.send_light}
              src="images/send_light.svg"
              alt="send"
              style={{ display: theme === "light" ? "block" : "none" }}
            />
          </div>
        </div>
      </div>
    </>
  );
}
