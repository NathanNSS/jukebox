import { useEffect, useRef, useState } from 'react'

import { MdPause, MdPlayArrow, MdVolumeUp, MdVolumeOff } from "react-icons/md"
import { IoPlayBack, IoPlayForward } from "react-icons/io5"

import styles from './styles.module.css';

import sound from '../music/Ice&Fire.mp3'

type changePlayer = "pause" | "play" | "back" | "next"

import capa from '../assets/capa_br1.png'

interface ITimer {
    duration: number;
    currentTime: number;
}

function secondsToTime(tempo: number) {

    let horas = Math.floor(tempo / 3600);
    let minutos = Math.floor((tempo - horas * 3600) / 60);
    let segundos = Math.floor(tempo % 60);

    const newHoras = String(horas).padStart(2, '0');
    const newMinutos = String(minutos).padStart(2, '0');
    const newSegundos = String(segundos).padStart(2, '0');

    if (tempo >= 3600) {
        return `${newHoras}:${newMinutos}:${newSegundos}`
    } else {
        return `${newMinutos}:${newSegundos}`
    }

}

export function MusicPlayer() {

    const [progress, setProgress] = useState(0)
    const [timer, setTimer] = useState<ITimer>({ currentTime: 0, duration: 0 })
    const [isPlayer, setIsPlayer] = useState(false)

    const player = useRef<HTMLAudioElement | null>(null)

    function changeSound(action: changePlayer) {
        if (player.current === null) throw Error("Não foi posivel concluir a operação")

        switch (action) {
            case "play":
                setIsPlayer(true)
                player.current.play()
                break;
            case "pause":
                setIsPlayer(false)
                player.current.pause()
                break;
            case "back":
                
                break;
            case "next":
                
                break;
            default:
                throw Error("Não foi posivel concluir a operação")
                break;
        }
    }



    function updateMusic() {
        if (player.current === null) throw Error("Não foi posivel concluir a operação")
        setTimer({
            duration: player.current.duration,
            currentTime: player.current.currentTime,
        })

        setProgress(player.current?.currentTime * 100 / player.current?.duration)
    }

    function changeTimeMusic(value: string) {
        player.current!.currentTime = Number(value)
    }

    function setSound() {
        if (player.current !== null) {
            return player.current
        }
        let audio = new Audio(sound)
        player.current = audio
    }

    useEffect(() => {
        setSound()
        if (player.current !== null) player.current.onloadeddata = () => updateMusic();
    }, [])

    if (player.current !== null) player.current.ontimeupdate = () => updateMusic();

    if (player.current === null) return null;
    return (
        <section className={styles.container}>
            <main className={styles.main}>
                <div className={styles.containerMusicInfo}>

                    <img src={capa} alt="Capa da Musica" className={styles.imgCapa} />

                    <div className={styles.info}>
                        <p className={styles.musicName}>
                            Acorda Devinho
                        </p>

                        <p className={styles.bandName}>
                            Banda Rocketseat
                        </p>
                    </div>

                </div>

                <div className={styles.containerController}>
                    <div className={styles.controler}>

                        <button type='button' title='back' className={styles.btnPlayer} onClick={() => player}>
                            <IoPlayBack />
                        </button>

                        <button type='button' title='pause/play' className={styles.btnPlayer} onClick={() => changeSound(isPlayer ? "pause" : "play")}>
                            {isPlayer ? <MdPause /> : <MdPlayArrow />}
                        </button>

                        <button type='button' title='next' className={styles.btnPlayer} onClick={() => player}>
                            <IoPlayForward />
                        </button>

                    </div>

                    <div className={styles.containerProgressBar}>
                        <div className={styles.progressBar} />
                        <div className={styles.progress} style={{ width: `${progress}%` }} />
                        <input type="range"
                            className={styles.inputRanger}
                            title={`${Math.floor(progress)}%`}
                            min={0}
                            max={timer?.duration}
                            value={player.current?.currentTime}
                            onChange={(e) => changeTimeMusic(e.target.value)}
                        />
                        <div className={styles.containerTime}>
                            <span>{secondsToTime(timer?.currentTime)}</span>
                            <span>{secondsToTime(timer?.duration)}</span>
                        </div>
                    </div>

                </div>

                {/* <audio controls ref={player} style={{position:"absolute", bottom:0 , left:0}}>
                    <source src={sound} type="audio/mpeg" />
                    Carrego não :/
                </audio> */}
            </main>
        </section>
    )
}

//MdPlayArrow