"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

interface ChatMessage {
  role: "user" | "bot";
  text: string;
}

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
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [textboxValue, setTextboxValue] = useState("");
  const countRef = useRef(count);
  //used to POST enitre chat
  const updatedMessages = [...messages, { role: "user", text: textboxValue }];

  // NEW: Add this ref for auto-scrolling
  const messagesEndRef = useRef<HTMLDivElement>(null);

  countRef.current = count;

  // NEW: Function to scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // NEW: Auto-scroll when messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    if (textboxValue.trim() === "") return;

    const userText = textboxValue;

    // Add user message immediately
    setMessages((prev) => [...prev, { role: "user", text: userText }]);
    setTextboxValue("");
    setShowMain(true);

    try {
      // Send entire message history to the API
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userText,
          history: updatedMessages // SEND ENTIRE MESSAGES HISTORY
        }),
      });

      const data = await res.json();

      // Add bot response from API
      setMessages((prev) => [
        ...prev,
        { role: "bot", text: data.reply },
      ]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
      // NEW: Array of possible bot responses
      const botResponses = [
        "I can help you with that!",
        "Here's what I found in our inventory...",
        "Would you like to see more options?",
        "That's a great choice!",
        "Let me check our laptop selection...",
        `Response ${messages.length + 1}: You asked about "${userText}"`,
        "I have several laptops that match your criteria.",
        "Would you like me to filter by price range?",
        "Here are the top 3 recommendations for you.",
        "That's an excellent question!",
        "Let me find the best deals for you.",
        "I can help you compare different models.",
        "What's your budget range?",
        "Are you looking for gaming or productivity?",
        "I'd recommend checking out our latest arrivals."
      ];

      // NEW: Select random response
      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)];

      // NEW: Add bot response after a short delay
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          { role: "bot", text: randomResponse },
        ]);
      }, 500);
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
                <a className={styles.link} href="">
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
                <p className={styles.logotext}>What would you like to buy?</p>
              </>
            )}

            <div className={styles.chatArea}>
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={
                    msg.role === "user"
                      ? styles.messageUser
                      : styles.messageBot
                  }
                >
                  {msg.text}
                </div>
              ))}
              {/* NEW: Empty div for auto-scrolling */}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <div className={styles.text}>
            <input
              placeholder="Ask anything..."
              id="textbox"
              className={styles.textbox}
              value={textboxValue}
              onChange={(e) => setTextboxValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  clearMain();
                }
              }}
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