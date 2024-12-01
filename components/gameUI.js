import { useEffect, useState } from "react" // core react imports
import dynamic from "next/dynamic"; // dynamic import for map
import { FaMap } from "react-icons/fa"; // map icon
import EndBanner from "./endBanner"; // end banner that shows distance, points, etc
import { FaExpand, FaMinimize, FaThumbtack } from "react-icons/fa6"; // map control icons
import { useTranslation } from 'next-i18next' // translation lib (only english, other locales not added)
import { toast } from "react-toastify"; // toast lib
import RoundOverScreen from "./roundOverScreen"; // screen that shows the round is over (5 games played)
import useWindowDimensions from "./useWindowDimensions";



export default function GameUI({ singlePlayerRound, setSinglePlayerRound, hintShown, setHintShown, pinPoint, setPinPoint, showAnswer, setShowAnswer, loading, setLoading, latLong, loadLocation, miniMapShown, setMiniMapShown }) {
  const { t: text } = useTranslation("common");
  const {width, height} = useWindowDimensions();

  // how to determine if touch screen?
  let isTouchScreen = false;
  if(window.matchMedia("(pointer: coarse)").matches) {
    isTouchScreen = true;
  }


  const [miniMapExpanded, setMiniMapExpanded] = useState(false) // whether the minimap is expanded
  const [miniMapFullscreen, setMiniMapFullscreen] = useState(false) // whether the minimap is fullscreen (after guessing)
  const [mapPinned, setMapPinned] = useState(false); // whether the map is pinned to the screen
  const [groundMap, setgroundMap] = useState("First");

  // dist between guess & target
  const [km, setKm] = useState(null);

  function showHint() {
    alert("Hint button pressed")
    setHintShown(true)
  }

  function guess() {
    alert("Guess button pressed")
  }

  useEffect(() => {
    function keydown(e) {
        if(e.key === " ") {
          alert("Space pressed")
        }
    }
    document.addEventListener('keydown', keydown);
    return () => {
      document.removeEventListener('keydown', keydown);
    }
  }, [pinPoint, showAnswer, singlePlayerRound])


  useEffect(() => {
    // reset the game when it's over
    loadLocation()
    if(singlePlayerRound) {
      setSinglePlayerRound({
        round: 1,
        totalRounds: 5,
        locations: []
      })
    }
  }, [])


  return (
    <div className="gameUI">

{/*  round over screen when 5 rounds are played */}
{ singlePlayerRound?.done && (
<RoundOverScreen points={singlePlayerRound.locations.reduce((acc, cur) => acc + cur.points, 0)}
maxPoints={25000}
history={singlePlayerRound.locations}
buttonText={text("playAgain")}
onHomePress={() =>{
  alert("Home button pressed")
              }}/>
)}
        <>


      <div id="miniMapArea" onMouseEnter={() => {
        setMiniMapExpanded(true)
      }} onMouseLeave={() => {
        if(mapPinned) return;
        setMiniMapExpanded(false)
      }} className={`miniMap ${miniMapExpanded ? 'mapExpanded' : ''}
      shown ${showAnswer ? 'answerShown' : 'answerNotShown'} ${miniMapFullscreen&&miniMapExpanded ? 'fullscreen' : ''}`}>

{!showAnswer && (
<div className="mapCornerBtns desktop" style={{ visibility: miniMapExpanded ? 'visible' : 'hidden' }}>
          <button className="cornerBtn" onClick={() => {
            setMiniMapFullscreen(!miniMapFullscreen)
            if(!miniMapFullscreen) {
              setMiniMapExpanded(true)
            }
          }}>{miniMapFullscreen  ? (
            <FaMinimize />
          ) : (
            <FaExpand />
          )}</button>
          <button className="cornerBtn" onClick={() => {
            setMapPinned(!mapPinned)
          }}>
            <FaThumbtack style={{ transform: mapPinned ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s' }} />
          </button>

  <button className="cornerBtn"
    style={{color: groundMap === "Ground" ? "blue" : "black"}}
onClick={() => {
  setgroundMap("Ground")
  }}>
    G
  </button>
  &nbsp;  &nbsp;
  &nbsp;


  <button className="cornerBtn" 
    style={{color: groundMap === "First" ? "blue" : "black"}}
    onClick={() => {
  setgroundMap("First")
  }}>
    1
  </button>
  &nbsp;  &nbsp;
  &nbsp;

  <button className="cornerBtn"
    style={{color: groundMap === "Second" ? "blue" : "black"}}

    onClick={() => {
  setgroundMap("Second")
  }}>
    2
  </button>
        </div>
)}


        { ((width > 600) || (width <= 600 && miniMapShown)) && (
          <img src={`/maps/${groundMap}.png`} alt="Map" className="map" style={{width: "100%", height: "100%", objectFit: "contain", userSelect: 'none', zIndex: 5, backgroundColor: 'white'}} />
  )}


        {/* Desktop hint&guess btn */}
        <div className={`miniMap__btns ${showAnswer ? 'answerShownBtns' : ''}`}>
        <button className={`miniMap__btn guessBtn `} onClick={guess}>{text('guess')}</button>

          <button className={`miniMap__btn hintBtn ${hintShown ? 'hintShown' : ''}`} onClick={showHint}>{text('hint')}</button>
        </div>
      </div>

      {/* guess and hint for mobile  */}
      <div className={`mobile_minimap__btns ${miniMapShown ? 'miniMapShown' : ''} ${(showAnswer||singlePlayerRound?.done) ? 'answerShownBtns' : ''}`}>
        {miniMapShown && (
          <>
            <button className={`miniMap__btn guessBtn `} onClick={guess}>{text('guess')}</button>
          <button className={`miniMap__btn hintBtn ${hintShown ? 'hintShown' : ''}`} onClick={showHint}>{text('hint')}</button>
          </>
        )}
        <button className={`gameBtn ${miniMapShown ? 'mobileMiniMapExpandedToggle' : ''}`} onClick={() => {
          setMiniMapShown(!miniMapShown)
        }}><FaMap size={miniMapShown ? 30 : 50} /></button>
      </div>
      </>

        {
          singlePlayerRound && !singlePlayerRound?.done && (
            <span className="timer shown">
              {text("round", {r: singlePlayerRound.round, mr: singlePlayerRound.totalRounds})} -  {singlePlayerRound.locations.reduce((acc, cur) => acc + cur.points, 0)} {text("points")}

            </span>
          )
        }

<div className="endCards">

<EndBanner singlePlayerRound={singlePlayerRound} usedHint={hintShown}  guessed={showAnswer} latLong={latLong} pinPoint={pinPoint} fullReset={()=>{
  loadLocationFunc()

  }} km={km}  toggleMap={() => {
    alert("Toggle map")
  }}  />
  </div>

    </div>
  )
}