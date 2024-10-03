import { FaArrowLeft} from "react-icons/fa";
import { FaArrowRotateRight } from "react-icons/fa6";
import { useTranslation } from 'next-i18next'

export default function Navbar({ shown, backBtnPressed, reloadBtnPressed, onNavbarPress, screen, loading }) {
  const { t: text } = useTranslation("common");

  const reloadBtn = (screen === 'singleplayer') && (!loading); // only show the reload button in singleplayer mode and when not loading

  return (
    <>
    { true && (
    <div className={`navbar ${shown ? "" : "hidden"}`}>
      <div className={`nonHome ${screen==='home'?'':'shown'}`}>
      <h1 className="navbar__title desktop" onClick={onNavbarPress}>JMGuessr</h1>
      <h1 className="navbar__title mobile" onClick={onNavbarPress}>JM</h1>

      <button className="gameBtn navBtn backBtn desktop" onClick={backBtnPressed}>{text("back")}</button>
      <button className="gameBtn navBtn backBtn mobile" onClick={backBtnPressed} style={{width: "50px"}}><FaArrowLeft /></button>
      </div>


      {reloadBtn && (
      <button className="gameBtn navBtn backBtn" style={{backgroundColor: '#000099'}} onClick={reloadBtnPressed}><FaArrowRotateRight /></button>
      )}

    </div>
)}
    </>
  )
}