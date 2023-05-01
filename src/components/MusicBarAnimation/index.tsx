
import styles from "./musicBarAnimationStyles.module.css"


export function MusicBarAnimation() {
    return (
        // adicionar classe "paused" quando não estiver tocando
        <div className={`${styles.now} ${styles.playing}`}>
            <span className={`${styles.bar} ${styles.n1}`}/>
            <span className={`${styles.bar} ${styles.n2}`}/>
            <span className={`${styles.bar} ${styles.n3}`}/>
            <span className={`${styles.bar} ${styles.n4}`}/>
            
        </div>
    )
}