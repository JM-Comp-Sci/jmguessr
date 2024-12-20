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
import locs from "@/public/locs.json"
// initialize the fonts we want to use
const jockey = Jockey_One({ subsets: ['latin'], weight: "400", style: 'normal' });

export default function Home({ }) {
  const [screen, setScreen] = useState("home");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState(null);
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [levelData, setLevelData] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);

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
    const target = locs.find(loc => new Date(loc.unlock) > new Date());
    if(!target) {
      setTimeRemaining(null);
      return;
    }
    const targetDate = new Date(target.unlock);
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
    setLevelData(null);
  };

  const playLevel = (loc) => {
    setScreen("singleplayer");
    setLevelData(loc);
    localStorage.setItem('loc', JSON.stringify(loc));
  }


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
              <h2>
                You have {userData.points} points
              </h2>
              { timeRemaining && (
              <h2>Next round in {timeRemaining}</h2>
              ) }
              <br/>
              <p><i>JMGuessr</i> is guessing game where you try to guess the location of photos taken inside JM on a map.</p>

              <a style={{color: 'gold'}} href="/leaderboard">View the leaderboard</a>
              <br/>
              <br/>


              <div class="container">

  {locs.map((loc, index) => (
    <button key={index} class="button" style={{
    backgroundColor: new Date(loc.unlock) < new Date() ?
    userData.history.length >= loc.id && userData.history[loc.id-1] !== null ?
    "green" :
    "gold" : "gray",
    cursor: new Date(loc.unlock) < new Date() ? "pointer" : "not-allowed",
    }}
    onClick={() => {
      if(new Date(loc.unlock) > new Date()) {
        toast.error("This level is not unlocked yet.");
        return;
      }
      // check if user has already played this level
      if(userData.history.length >= loc.id && userData.history[loc.id-1] !== null) {
        toast.error("You have already played this location.");
        return;
      }
      playLevel(loc);
    }}>
      {loc.id}
    </button>
  ))}
</div>




              </center>
            </div>
          </div>
        )}

        {/* Singleplayer game content */}
        {screen === "singleplayer" && <div className="home__singleplayer">
          <GameUI
          showAnswer={showAnswer}
          setShowAnswer={setShowAnswer}
             loc={levelData} backBtnPressed={backBtnPressed} />
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
