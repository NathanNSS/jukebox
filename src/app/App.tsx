import { useEffect, useRef, useState } from "react";

import { TfiMoreAlt } from "react-icons/tfi"
import { FaRegHeart } from "react-icons/fa"
import {
    MdPause,
    MdPlayArrow,
    MdQueueMusic,
    MdSkipNext,
    MdSkipPrevious,
    MdRepeat,
    MdVolumeUp,
} from "react-icons/md"
import { IoPlayBack, IoPlayForward, IoShuffle } from "react-icons/io5";

import { MusicPlayer } from "./Player";
import { MusicSelection, Item as IMusics } from "./MusicSelection";
import { MusicBarAnimation } from "../components/MusicBarAnimation";

import { secondsToTime, shuffle, timeInWords } from "../utils";

import styles from './styles.module.css'
import { VolumePlayer } from "../components/VolumePlayer";

interface IFocusPlayer {
    focus: boolean;
    focusAnimation: boolean;
}

interface ITimer {
    duration: number;
    currentTime: number;
}

type changePlayer = "pause" | "play" | "back" | "next"

const initFocusPlayer = {
    focus: false,
    focusAnimation: false
} as IFocusPlayer

export function App() {
    const [musics, setMusics] = useState<IMusics[]>([])
    const [currentMusic, setCurrentMusic] = useState<IMusics>(musics[0])

    const [focusPlayer, setFocusplayer] = useState<IFocusPlayer>(initFocusPlayer)

    const [isPlayer, setIsPlayer] = useState(false)
    const [progress, setProgress] = useState(0)
    const [timer, setTimer] = useState<ITimer>({ currentTime: 0, duration: 0 })
    const [volume, setVolume] = useState(0.7) // 0 ate 1
    const [isRandom, setIsRandom] = useState(false)
    const [isRepeat, setIsRepeat] = useState(false)

    const player = useRef<HTMLAudioElement | null>(null)

    const sizePlaylist = musics.length - 1

    function updateMusic() {
        if (player.current === null) throw Error("Não foi posivel concluir a operação de atualizar os dados da musica")

        let duration = isNaN(player.current.duration) ? 0 : player.current.duration

        setTimer({
            duration: duration,
            currentTime: player.current.currentTime,
        })


        setProgress(player.current?.currentTime * 100 / duration)
    }

    function changeTimeMusic(value: string) {
        player.current!.currentTime = Number(value)
    }

    function changeMusicVolume(value: string) {
        let volume = Number(value)

        if (player.current)
            player.current.volume = volume

        setVolume(volume)
    }

    function changeMusicMuted() {

        let vol: number = 0

        if (player.current) {
            vol = player.current.volume

            !player.current.muted ? player.current.muted = true : player.current.muted = false
        }
    }

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
                prevSong()
                break;

            case "next":
                nextSong()
                break;
            default:
                throw Error(`Não foi posivel fazer a ação ${action} no controlador`)
                break;
        }
    }

    function setSound(song: IMusics) {
        if (player.current !== null) player.current.pause()

        let audio = new Audio(song.audioUrl)
        player.current = audio
        player.current.volume = volume
        isPlayer && player.current.play()
    }

    function nextSong() {
        let currentItem = musics.findIndex(item => item.id === currentMusic.id)
        let nextItem = currentItem + 1 > sizePlaylist ? 0 : currentItem + 1
        setSound(musics[nextItem])
        setCurrentMusic(musics[nextItem])
    }

    function prevSong() {
        let currentItem = musics.findIndex(item => item.id === currentMusic.id)
        let prevItem = currentItem - 1 < 0 ? sizePlaylist : currentItem - 1
        setSound(musics[prevItem])
        setCurrentMusic(musics[prevItem])
    }

    function setMM(item: IMusics[]) {
        setMusics(item)
        setCurrentMusic(item[0])
    }

    function handleFocusPlayer(state: "start" | "close") {
        let idTime
        if (state === "close") {
            clearTimeout(idTime)

            setFocusplayer(prev => ({ ...prev, focusAnimation: false }))

            idTime = setTimeout(() => {
                setFocusplayer(prev => ({ ...prev, focus: false }))
            }, 700)
        } else {
            setFocusplayer({ focus: true, focusAnimation: true })
        }

    }

    function handleSetSound(item: IMusics) {
        setSound(item);
        setCurrentMusic(item);
        handleFocusPlayer("start");
    }

    function shuffleList() {
        let newArray
        if (isRandom) {
            newArray = musics.slice();
            setMusics(newArray.sort((item1, item2) => item1.id - item2.id))
            setIsRandom(prev => !prev)
        } else {
            newArray = shuffle(musics)
            setMusics(newArray)
            setIsRandom(prev => !prev)
        }
    }

    useEffect(() => {
        if (player.current === null && musics.length) {
            setSound(musics[0])

            setCurrentMusic(musics[0])
        }

        //Voltar em casos de bug com auto play
        // return () => {
        //     player.current?.pause();
        //     setIsPlayer(false);
        // }
    }, [musics])

    if (player.current !== null) {
        player.current.onloadeddata = () => updateMusic();
        player.current.ontimeupdate = () => updateMusic();
        player.current.onended = () => {
            let currentItem = musics.findIndex(item => item.id === currentMusic.id)
            let endList = currentItem + 1 > sizePlaylist

            if (endList && isRepeat === false) {
                return null
            }

            nextSong()
        }
    }

    if (musics.length === 0) return <MusicSelection setMusics={setMM} />

    if (player.current === null) return <section style={{ width: "100vw", height: "100vh", backgroundColor: "#111111" }}></section>;

    return (
        <div>
            <section className={styles.container}>

                <div className={styles.header}>
                    <div className={styles.contentHeader}>
                        <img style={document.body.clientWidth > 480 ? { width: "200px" } : { width: "100px", height: "100px" }} src="https://img.freepik.com/vetores-gratis/ups-erro-404-com-ilustracao-de-conceito-de-robo-quebrado_114360-5529.jpg?w=2000" alt="Capas da Musicas" />
                        <div className={styles.infoHeader}>
                            <h5>PLAYLIST</h5>
                            <h1>This is Maribou State</h1>

                            <p>This is Maribou State </p>
                            <p> &nbsp; {`${musics.length} song${musics.length > 1 ? "s " : " "}`}
                                - {timeInWords(musics.reduce((prev, current)=> prev + current.duration, 0 ))}
                            </p>
                        </div>
                    </div>
                </div>
                <div className={styles.content}>

                    <div className={styles.actionListContainer}>
                        <button type='button' title='pause/play' className={styles.btnHandlePlayer} onClick={() => changeSound(isPlayer ? "pause" : "play")}>
                            {isPlayer ? <MdPause /> : <MdPlayArrow />}
                        </button>
                        <button className={styles.btnMoreAction}>
                            <TfiMoreAlt size={20} color="white" />
                        </button>
                    </div>

                    <div className={styles.listMusic}>
                        <table>
                            <thead>
                                <tr>
                                    <th
                                        colSpan={3}
                                        scope="row"
                                        className={styles.hTitle}
                                    >My Playlist</th>
                                    <th className={styles.hAlbum}>ALBUM</th>
                                    <th className={styles.hDuration}>DURATION</th>
                                    <th className={styles.hAction}></th>
                                    <th className={styles.hAction}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {musics.map(item => (
                                    <tr
                                        key={item.id}
                                        title={item.title}
                                        onClick={() => handleSetSound(item)}
                                        className={`${item.id === currentMusic.id ? styles.selection : ""}`}
                                    >
                                        <td className={styles.bId}>
                                            {item.id === currentMusic.id && isPlayer ?
                                                <MusicBarAnimation />
                                                : Math.floor(item.id)

                                            }
                                        </td>
                                        <td className={styles.bImg}>
                                            <img src={item.imgUrl} alt="imagem album" className={styles.imglist} />
                                        </td>
                                        <td className={styles.bTitle}>{item.title}</td>
                                        <td className={styles.bAlbum}>{item.genre}</td>
                                        <td className={styles.bDuration}>{secondsToTime(item.duration)}</td>
                                        <td className={styles.bAction}><FaRegHeart color="white" /></td>
                                        <td className={styles.bAction}><TfiMoreAlt size={10} color="white" /></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                </div>

            </section>
            <footer className={styles.containerFooter}>

                <div className={styles.infoMusic}>
                    <img
                        src={currentMusic.imgUrl}
                        alt="capa do album"
                        className={styles.capaAlbum}
                    />

                    <div className={styles.descMusic}>
                        <p>{currentMusic.title}</p>
                        <p>{currentMusic.artist}</p>
                    </div>

                    <FaRegHeart />
                </div>

                <div className={styles.containerControllers}>

                    <div className={styles.controller}>
                        <button
                            type="button"
                            title="Random"
                            style={isRandom ? { color: "#b6bec4" } : undefined}
                            onClick={shuffleList}
                        >
                            <IoShuffle />
                        </button>
                        <div className={styles.controllerActionButtons}>
                            <button
                                type="button"
                                title='Back'
                                onClick={() => changeSound("back")}
                            >
                                <MdSkipPrevious />
                            </button>

                            <button
                                type="button"
                                title="Pause / Player"
                                className={styles.controllerFooterBtnPlayer}
                                onClick={() => changeSound(isPlayer ? "pause" : "play")}
                            >
                                {isPlayer ? <MdPause /> : <MdPlayArrow />}
                            </button>

                            <button
                                type="button"
                                title='Next'
                                onClick={() => changeSound("next")}
                            >
                                <MdSkipNext />
                            </button>
                        </div>
                        <button
                            type="button"
                            title="Repeat"
                            style={isRepeat ? { color: "#b6bec4" } : undefined}
                            onClick={() => setIsRepeat(prev => !prev)}
                        >
                            <MdRepeat />
                        </button>
                    </div>

                    <div className={styles.containerProgress}>
                        <span>{secondsToTime(timer?.currentTime)}</span>

                        <input type="range"
                            className={styles.inputRanger}
                            title={`${Math.floor(progress)}%`}
                            min={0}
                            step={0.001}
                            max={timer.duration}
                            value={timer.currentTime}
                            onChange={(e) => changeTimeMusic(e.target.value)}
                        />

                        <span>{secondsToTime(timer?.duration)}</span>
                    </div>

                </div>

                <div className={styles.containerActions}>
                    <button type="button" onClick={() => handleFocusPlayer("start")}>
                        <MdQueueMusic />
                    </button>

                    <VolumePlayer
                        volume={player.current.volume}
                        muted={player.current.muted}
                        changeMusicVolume={changeMusicVolume}
                        changeMusicMuted={changeMusicMuted}
                    />
                </div>

                <div className={styles.containerControllerMobile}>
                    <button
                        type="button"
                        title="Pause / Player"
                        className={styles.controllerMobile}
                        onClick={() => changeSound(isPlayer ? "pause" : "play")}
                    >
                        {isPlayer ? <MdPause /> : <MdPlayArrow />}
                    </button>
                </div>

            </footer>
            {focusPlayer.focus &&
                <MusicPlayer
                    music={currentMusic}
                    changeSound={changeSound}
                    changeTimeMusic={changeTimeMusic}
                    isPlayer={isPlayer}
                    progress={progress}
                    timer={timer}
                    handleFocusPlayer={handleFocusPlayer}
                    className={focusPlayer.focusAnimation ? styles.startContainer : styles.closeContainer}
                />
            }
        </div>
    )
}