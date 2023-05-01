export function secondsToTime(tempo: number) {

    if (isNaN(tempo)) return "00:00"

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

export function shuffle<T>(array: Array<T>): T[] {
    let newArray = array.slice();
    let currentIndex = newArray.length, randomIndex;

    // While there remain elements to shuffle.
    while (currentIndex != 0) {

        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // And swap it with the current element.
        [newArray[currentIndex], newArray[randomIndex]] = [
            newArray[randomIndex], newArray[currentIndex]];
    }

    return newArray;
}

export async function getDurationSound(urlSound: string): Promise<number> {
    return new Promise<number>(function (resolve) {
        let audio = new Audio(urlSound);

        audio.addEventListener("loadedmetadata", () => {
            resolve(audio.duration);
        });
    });

}

export function timeInWords(tempo: number): string {
    if (isNaN(tempo)) return "00:00"

    let horas = Math.floor(tempo / 3600);
    let minutos = Math.floor((tempo - horas * 3600) / 60);

    const newMinutos = String(minutos).padStart(2, '0');

    if (tempo >= 3600) {
        return `${horas}h ${newMinutos}min`
    } else {
        return `${newMinutos}min`
    }
}

