// importing everything we need

import React from "react";
import { useEffect, useState, useRef } from "react"; // core react hooks
import NextImage from "next/image"; // <img> tag in nextjs

import HeadContent from "@/components/headContent"; // html <head> content
import { Jockey_One } from 'next/font/google'; // fonts (we can change this later)
import 'react-responsive-modal/styles.css'; // modal css
import { toast, ToastContainer } from "react-toastify"; // toast (top right notifications)
import 'react-toastify/dist/ReactToastify.css'; // toast css
import { useTranslation } from 'next-i18next' // translation lib (only english, other locales not added)
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

// custom components
import Navbar from "@/components/ui/navbar"; // navigation bar at the top
import GameUI from "@/components/gameUI"; // core game ui
import BannerText from "@/components/bannerText"; // full-screen text that fills up the page (eg. Loading..)

// initialize the fonts we want to use
const jockey = Jockey_One({ subsets: ['latin'], weight: "400", style: 'normal' });

export default function Home({ }) {
  const [miniMapShown, setMiniMapShown] = useState(false) // whether the minimap is shown
  // defining "states" our site can be in
  const [screen, setScreen] = useState("home"); // what mode we are in. can be ['home', 'singleplayer']
  const [loading, setLoading] = useState(false); // set this to true if we are loading something

  const [latLong, setLatLong] = useState({ lat: 0, long: 0 }) // current location to be guessed. needs to be reworked, we need a coordinate system for the school
  const [showAnswer, setShowAnswer] = useState(false) // whether the user is guessing (false) or they pressed guess and answer is shown (true)

  const [pinPoint, setPinPoint] = useState(null) // where the user has their pin.
  const [hintShown, setHintShown] = useState(false) // if a hint is shown

  const [singlePlayerRound, setSinglePlayerRound] = useState(null); // data about the current game (total points / 25000, locations, etc)

  // old translation system
  const { t: text } = useTranslation("common"); // used like text('key') to get the translation

  // when user presses the worldguessr logo
  function onNavbarLogoPress() {
  }

  // when user presses reload btn
  function reloadBtnPressed() {

  }

  // when user presses red back btn
  function backBtnPressed() {
    if (loading) setLoading(false); // if we are loading, stop loading

    if (screen === "singleplayer") { // if we are in singleplayer mode
      // reset the game
      setScreen("home")
      setPinPoint(null)
      setLatLong(null)
      setShowAnswer(false)
      setHintShown(false)
      setSinglePlayerRound(null)
    }
  }


  function loadLocation() {
    if (loading) return; // dont load a new location if we are already loading smth
    setMiniMapShown(false)
    alert("loadLocation")
  }


  // return what to render on the page (in JSX). we use {/* */} to comment in jsx
  return (
    <>
      {/* <head> tag */}
      <HeadContent text={text} />

      {/* automatic container for any notifications (should we choose to use them) */}
      <ToastContainer />

      {/* background image */}
      <div style={{
        top: 0,
        left: 0,
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        transition: 'opacity 0.5s',
        opacity: 1,
        userSelect: 'none',
        WebkitUserSelect: 'none',
        MozUserSelect: 'none',
        msUserSelect: 'none',
        pointerEvents: 'none',
      }}>
        <NextImage.default src={'/Main-background.jpg'}
          draggable={false}
          fill alt="Game Background" style={{ objectFit: "cover", userSelect: 'none' }}
        />
      </div>


      {/* main content, including fonts here */}
      <main className={`home ${jockey.className}`} id="main">

        {/* big loading text in case loading state is true */}
        <BannerText text={`${text("loading")}...`} shown={loading} showCompass={true} />

        {/* navigation bar at the top */}
        <Navbar loading={loading} shown={true} reloadBtnPressed={reloadBtnPressed} backBtnPressed={backBtnPressed}  onNavbarPress={onNavbarLogoPress} screen={screen} />

        {/* home page content */}
        <div className={`home__content ${screen !== "home" ? "hidden" : ""}`}>
          <div className="home__ui">
            <h1 className="home__title">JM Geoguessr</h1>

            <div className="home__btns">
              <div className={`mainHomeBtns`}>

                {/* play button */}
                <button className="homeBtn" onClick={() => {
                  if (!loading) setScreen("singleplayer")
                }} >Play now</button>

              </div>
            </div>
          </div>
        </div>


        {/* singleplayer game content */}
        {screen === "singleplayer" && <div className="home__singleplayer">
          <GameUI singlePlayerRound={singlePlayerRound} setSinglePlayerRound={setSinglePlayerRound} hintShown={hintShown} setHintShown={setHintShown} pinPoint={pinPoint} setPinPoint={setPinPoint} showAnswer={showAnswer} setShowAnswer={setShowAnswer} loading={loading} setLoading={setLoading} latLong={latLong} loadLocation={loadLocation} miniMapShown={miniMapShown} setMiniMapShown={setMiniMapShown} />
        </div>}
      </main>
    </>
  )
}

// ignore this, its part of the old translation system
export async function getStaticProps({ locale }) {
  return {
    props: {
      ...(await serverSideTranslations(locale, [
        'common',
      ])),
    },
  }
}
