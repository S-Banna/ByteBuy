// app/buyer/page.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import styles from "./page.module.css";

interface ChatMessage {
    role: "user" | "bot";
    text: string;
}

export default function Page() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(true); // Start with popup open
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginError, setLoginError] = useState("");

    const [iconState, setIconState] = useState("send"); // "send" or "loading"
    const [theme, setTheme] = useState<"dark" | "light">("dark");
    const [showMain, setShowMain] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [textboxValue, setTextboxValue] = useState("");
    const [previousResponseId, setPreviousResponseId] = useState<string | null>(null);

    const imgSrc =
        iconState === "loading"
            ? `images/loading_${theme}.gif`
            : `images/send_${theme}.svg`;

    // Add this ref for auto-scrolling
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const handleLogin = () => {
        if (email === "admin" && password === "admin") {
            setIsLoggedIn(true);
            setShowLoginPopup(false);
            setLoginError("");
        } else {
            setLoginError("Invalid credentials. Use admin/admin");
        }
    };

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

        if (iconState === "loading") return;

        setIconState("loading");

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
                    message: userText,
                    previousMessageId: previousResponseId,
                }),
            });

            const data = await res.json();

            setMessages((prev) => [
                ...prev,
                { role: "bot", text: data.reply }
            ]);

            setPreviousResponseId(data.responseId);

            setIconState("send");

        } catch (error) {
            console.error("Error sending message:", error);
            setIconState("send");
        }
    }

    if (!isLoggedIn) {
        return (
            <>
                <style>{`
                    body { margin: 0; font-family: sans-serif; overflow: hidden; }
                `}</style>
                <div style={{
                    height: "100vh",
                    overflow: "hidden"
                }}>
                    {/* Your blurred background content - can be empty or show chat blurred */}
                    <div style={{ height: "100vh", backgroundColor: theme === "dark" ? "#212121" : "#fff" }}></div>
                </div>

                {/* Login Popup */}
                <div style={{
                    position: "fixed",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(44, 44, 44, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: theme === "dark" ? "rgb(33, 33, 33)" : "#fff",
                        padding: "2rem",
                        borderRadius: "20px",
                        border: "2px solid #313131",
                        height: "400px",
                        width: "300px",
                        boxShadow: "0 4px 20px rgba(91, 80, 80, 0.3)",
                    }}>
                        <h2 style={{ marginTop: "80px", marginBottom: "1rem", textAlign: "center", color: theme === "dark" ? "#fff" : "#000" }}>Sign in to ByteBuy</h2>

                        <input
                            type="text"
                            placeholder="Email (admin)"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            style={{
                                color: "white",
                                width: "100%",
                                padding: "12px",
                                marginBottom: "1rem",
                                borderRadius: "20px",
                                border: "1px solid #434343",
                                boxSizing: "border-box",
                                backgroundColor: "rgb(47, 47, 47)",
                                outline: "none"
                            }}
                        />

                        <input
                            type="password"
                            placeholder="Password (admin)"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
                            style={{
                                color: "white",
                                width: "100%",
                                padding: "12px",
                                marginBottom: "1rem",
                                borderRadius: "20px",
                                border: "1px solid #434343",
                                boxSizing: "border-box",
                                backgroundColor: "rgb(47, 47, 47)",
                                outline: "none"
                            }}
                        />

                        {loginError && (
                            <div style={{ color: "red", marginBottom: "1rem", fontSize: "0.875rem" }}>
                                {loginError}
                            </div>
                        )}

                        <button
                            onClick={handleLogin}
                            style={{
                                width: "30%",
                                padding: "0.5rem",
                                backgroundColor: "#ffffff",
                                color: "black",
                                border: "2px solid rgb(211, 211, 211)",
                                borderRadius: "15px",
                                cursor: "pointer",
                                marginLeft: "100px"
                                
                            }}
                        >
                            Sign In
                        </button>
                    </div>
                </div>
            </>
        );
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
                            src={imgSrc}
                            alt="send"
                            style={{
                                display: theme === "dark" ? "block" : "none",
                            }}
                        />
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            onClick={clearMain}
                            className={styles.send_light}
                            src={imgSrc}
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
