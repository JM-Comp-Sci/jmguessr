import React, { useEffect, useState } from "react";
import NextImage from "next/image";
import HeadContent from "@/components/headContent";
import { Jockey_One } from 'next/font/google';
import 'react-responsive-modal/styles.css';
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

import Navbar from "@/components/ui/navbar";
import GameUI from "@/components/gameUI";
import BannerText from "@/components/bannerText";
import Login from "@/components/Login";

// initialize the fonts we want to use
const jockey = Jockey_One({ subsets: ['latin'], weight: "400", style: 'normal' });

export default function Home({ }) {
  const [screen, setScreen] = useState("home");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);

  const { t: text } = useTranslation("common");

  // Fetch user data by secret from localStorage
  useEffect(() => {
    const secret = localStorage.getItem('secret');
    if (secret) {
      fetchUserData(secret);
    }
  }, []);

  useEffect(() => {
    if (userData) {
      const interval = setInterval(() => {
        calculateTimeRemaining();
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [userData]);

  const fetchUserData = async (secret) => {
    try {
      const response = await fetch(`/api/getuserbysecret?secret=${secret}`);
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      const data = await response.json();
      setUserData(data.user);
    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Error fetching user data.');
    }
  };

  const calculateTimeRemaining = () => {
    // Set the target time (Dec 9th at 1 PM CST)
    const targetDate = new Date('2024-12-13T13:00:00-06:00'); // CST is UTC-6
    const currentTime = new Date();

    // Calculate the remaining time in milliseconds
    const remainingTime = targetDate - currentTime;

    if (remainingTime <= 0) {
      setTimeRemaining("The competition has started!");
    } else {
      const days = Math.floor(remainingTime / (1000 * 60 * 60 * 24));
      const hours = Math.floor((remainingTime % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
      setTimeRemaining(`${days}d ${hours}h ${minutes}m ${seconds}s`);

    }
  };

  const handleLogin = async (data) => {
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Login failed:', errorData.error);
        toast.error(`Login failed: ${errorData.error}`);
        return;
      }

      const userData = await response.json();
      localStorage.setItem('secret', userData.user.secret);
      setUserData(userData.user);
      setScreen("home");
    } catch (error) {
      console.error('An error occurred during login:', error);
      toast.error('An error occurred. Please try again.');
    }
  };

  const backBtnPressed = () => {
    setScreen("home");
    setUserData(null);
  };

  return (
    <>
      <HeadContent text={text} />
      <ToastContainer />

      <div style={{
        top: 0,
        left: 0,
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        transition: 'opacity 0.5s',
        opacity: 1,
        userSelect: 'none',
        pointerEvents: 'none',
      }}>
        <NextImage.default src={'/Main-background.jpg'} draggable={false} fill alt="Game Background" style={{ objectFit: "cover", userSelect: 'none' }} />
      </div>

      <main className={`home ${jockey.className}`} id="main">
        <BannerText text={`${text("loading")}...`} shown={loading} showCompass={true} />

        <Navbar loading={loading} shown={true} backBtnPressed={backBtnPressed} screen={screen} />

        <div className={`home__content ${(screen !== "home" || userData)
          ? "hidden" : ""}`}>
          <div className="home__ui">
            <h1 className="home__title">JMGuessr</h1>
            <p className="home__subtitle">How well do you know JM?</p>

            <div className="home__btns">
              <div className={`mainHomeBtns`}>
                <button className="homeBtn" onClick={() => setScreen("login")}>
                  Enter the Competition
                </button>
              </div>
            </div>
          </div>
        </div>

        {screen === "login" && <Login onLogin={handleLogin} />}

        {/* Display Hello User screen when logged in */}
        {screen === "home" && userData && (
          <div className="loggedInScreen">
            <div className="loggedInContent">
              <center>
              <h1>Welcome, {userData.firstName}!</h1>
              <h2>Competiton begins in {timeRemaining}</h2>
              <br/>
              <p><i>JMGuessr</i> is guessing game where you try to guess the location of photos taken inside JM on a map.</p>
              <p>Unfortunately, we had to postpone the game to Fri, Dec 13th at 1 oclock.</p>
              <br/>

              <h3>Study the maps</h3>
              <a style={{ color: "cyan" }}
               href="/ground.png" target="_blank" rel="noreferrer">Ground Floor</a>
              <br/>
              <a
style={{ color: "cyan" }}
              href="/first.png" target="_blank" rel="noreferrer">First Floor</a>
              <br/>
              <a style={{ color: "cyan" }}
              href="/second.png" target="_blank" rel="noreferrer">Second Floor</a>
              </center>
            </div>
          </div>
        )}

        {/* Singleplayer game content */}
        {screen === "singleplayer" && <div className="home__singleplayer">
          <GameUI />
        </div>}
      </main>
    </>
  );
}

// ignore this, part of old translation system
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
    },
  };
}
