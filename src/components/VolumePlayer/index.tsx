import { useState } from "react";
import { MdVolumeUp, MdVolumeDown, MdVolumeOff } from "react-icons/md";

import styles from "./volumePlayerstyles.module.css"

interface Props {
    volume: number;
    muted: boolean;
    changeMusicMuted: ()=> void;
    changeMusicVolume: (value: string) => void;
}

export function VolumePlayer({ volume, muted, changeMusicMuted, changeMusicVolume }: Props) {
    const [isMouseOver, setIsMouseOver] = useState<undefined | boolean>(undefined)

    function rederIcon(volume: number): JSX.Element {

        if (volume === 0 || muted === true)
            return <MdVolumeOff />
        if (volume < 0.5)
            return <MdVolumeDown />
        if (volume > 0.5)
            return <MdVolumeUp />

        return <MdVolumeUp />

    }

    return (
        <div
            onMouseEnter={() => setIsMouseOver(true)}
            onMouseLeave={() => setIsMouseOver(false)}
            className={styles.containerVolume}
        >
            <div
                className={`
                    ${styles.boxVolumeBar}
                    ${isMouseOver !== undefined ? isMouseOver ? styles.volumeStart : styles.volumeEnd : ""}
                `}
            >
                <input
                    type="range"
                    min={0}
                    max={1}
                    step={0.05}
                    title={`${Math.floor(volume * 100 / 1)}%`}
                    value={volume}
                    className={`
                        ${styles.volumeBar}
                        ${isMouseOver !== undefined ? isMouseOver ? styles.volumeStart : styles.volumeEnd : ""}
                    `}
                    onChange={(e) => changeMusicVolume(e.target.value)}
                />
            </div>
            <button
                type="button" 
                title="volume"
                onClick={changeMusicMuted}
                className={styles.btnVolume}
            >
                {rederIcon(volume)}
            </button>
        </div>
    )
}