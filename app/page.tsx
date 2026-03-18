"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

interface ChatMessage {
    role: "user" | "bot";
    text: string;
}

export default function Page() {
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [showMain, setShowMain] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [textboxValue, setTextboxValue] = useState("");

    // Add this ref for auto-scrolling
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Function to scroll to bottom
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    // Auto-scroll when messages change
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    function toggleTheme() {
        setTheme((prev) => (prev === "dark" ? "light" : "dark"));
    }

    async function clearMain() {
        if (textboxValue.trim() === "") return;

        const userText = textboxValue;

        const nextMessages: ChatMessage[] = [
            ...messages,
            { role: "user", text: userText }
        ];
        setMessages(nextMessages);
        setTextboxValue("");
        setShowMain(true);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    messages: nextMessages
                }),
            });

            const reader = res.body?.getReader();
            const decoder = new TextDecoder();

            let botMessage = "";

            // Add empty bot message first
            setMessages((prev) => [...prev, { role: "bot", text: "" }]);

            while (true) {
                const { done, value } = await reader!.read();
                if (done) break;

                const chunk = decoder.decode(value);
                botMessage += chunk;

                setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        role: "bot",
                        text: botMessage,
                    };
                    return updated;
                });
            }
        } catch (error) {
            console.error("Error sending message:", error);
        }
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
                        <span className={styles.invSpan}>
                            User Chat History
                        </span>
                    </p>
                </div>

                <div className={styles.main}>
                    <div className={styles.darkmode}>
                        <p className={styles.ByteBuy}>
                            <a className={styles.link} href="">
                                ByteBuy
                            </a>
                        </p>
                        <button
                            className={styles.themeBtn}
                            onClick={toggleTheme}>
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
                                    display:
                                        theme === "light" ? "block" : "none",
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
                                    display:
                                        theme === "dark" ? "block" : "none",
                                    width: 100,
                                    margin: "auto",
                                }}
                            />
                            <p className={styles.logotext}>
                                What would you like to buy?
                            </p>
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
                                }>
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
                            style={{
                                display: theme === "dark" ? "block" : "none",
                            }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            onClick={clearMain}
                            className={styles.send_light}
                            src="images/send_light.svg"
                            alt="send"
                            style={{
                                display: theme === "light" ? "block" : "none",
                            }}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
