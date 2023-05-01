import { HTMLAttributes, useEffect, useRef, useState } from 'react'

import { MdPause, MdPlayArrow, MdVolumeUp, MdVolumeOff, MdKeyboardArrowDown } from "react-icons/md"
import { IoPlayBack, IoPlayForward } from "react-icons/io5"

import styles from './playerStyles.module.css';

import { Item as IMusics } from "../MusicSelection";
import {secondsToTime} from '../../utils'

type changePlayer = "pause" | "play" | "back" | "next"

interface ITimer {
    duration: number;
    currentTime: number;
}

interface Props {
    music: IMusics;
    isPlayer: boolean;
    progress: number;
    timer: ITimer;
    className?: string;
    handleFocusPlayer: (state: "start" | "close") => void;
    changeSound:(action: changePlayer) => void;
    changeTimeMusic: (value:string) => void;
}

export function MusicPlayer({ handleFocusPlayer, className, music, changeSound, isPlayer, progress, timer, changeTimeMusic }: Props) {

    const [song, setSong] = useState<IMusics>(music)

    useEffect(() => {
        setSong(music)
    }, [music])

    return (
        <section
            className={`
                ${styles.container} 
                
                ${className !== undefined && className}
            `}>

            <button
                type='button'
                onClick={() => handleFocusPlayer("close")}
                className={styles.btnClosePlayer}
            >
                <MdKeyboardArrowDown/>
            </button>

            <main className={styles.main}>
                <div className={styles.containerMusicInfo}>

                    <img src={song.imgUrl} alt="Capa da Musica" className={styles.imgCapa} />

                    <div className={styles.info}>
                        <p className={styles.musicName}>
                            {song.title ?? 'Acorda Devinho'}
                        </p>

                        <p className={styles.bandName}>
                            {song.genre ?? 'Banda Rocketseat'}
                        </p>
                    </div>

                </div>

                <div className={styles.containerController}>
                    <div className={styles.controler}>

                        <button type='button' title='back' className={styles.btnPlayer} onClick={() => changeSound("back")}>
                            <IoPlayBack />
                        </button>

                        <button type='button' title='pause/play' className={styles.btnPlayer} onClick={() => changeSound(isPlayer ? "pause" : "play")}>
                            {isPlayer ? <MdPause /> : <MdPlayArrow />}
                        </button>

                        <button type='button' title='next' className={styles.btnPlayer} onClick={() => changeSound("next")}>
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
                            value={timer.duration}
                            onChange={(e) => changeTimeMusic(e.target.value)}
                        />
                        <div className={styles.containerTime}>
                            <span>{secondsToTime(timer?.currentTime)}</span>
                            <span>{secondsToTime(timer?.duration)}</span>
                        </div>
                    </div>

                </div>
            </main>
        </section>
    )
}

//MdPlayArrow