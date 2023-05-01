import { useReducer, useState } from 'react'
import { RiSave3Fill, RiDeleteBin5Fill, RiFolderAddFill } from 'react-icons/ri'
import { TbArrowBigDownLinesFilled } from 'react-icons/tb'
import { BsExclamationCircleFill, BsFillFileEarmarkCheckFill } from 'react-icons/bs'
import * as jsm from 'jsmediatags'

import styles from './musicSelectionStyles.module.css'
import { PictureType, TagType } from 'jsmediatags/types';
import { DropZone } from '../../components/DropZone/Index';
import { FileError, FileRejection } from 'react-dropzone';
import { CaptureFiles } from '../../components/CaptureFiles'
import { getDurationSound } from '../../utils'

interface Props{
    setMusics: (sounds: Item[]) => void
}

export interface Item {
    id: number;
    title: string;
    artist: string;
    genre: string;
    duration:number;
    size: number;
    imgUrl: string;
    audioUrl: string;
}

interface ItemRejection {
    item: Item,
    errors: FileError[]
}

interface IList {
    accepted: Item[] | null,
    rejection: ItemRejection[] | null
}

interface IAcceptItem {
    newArray: ItemRejection[];
    itemAccept: Item;
}

var MusicsList = {
    accepted: [],
    rejection: []
} as IList

export function MusicSelection({setMusics}:Props) {
    const [list, setList] = useState<IList>(MusicsList)

    async function getMetaDataAsync(file: File, i: number): Promise<Item> {
        return new Promise((resolve, reject) => {
            const audioUrl =  URL.createObjectURL(file)
            jsm.read(file, {
                onSuccess: async (data) => {
                    let {
                        title,
                        artist = "Not Found",
                        genre = "Not Found",
                        picture
                    } = data.tags

                    resolve({
                        id: i,
                        title: title ? title : file.name.split(".")[0],
                        artist: artist,
                        genre: genre,
                        duration: await getDurationSound(audioUrl),
                        size: file.size,
                        imgUrl: await formatImg(picture),
                        audioUrl: audioUrl
                    } as Item
                    )
                },
                onError: async (data) => {
                    resolve({
                        id: i,
                        title: file.name.split(".")[0],
                        artist: "Not Found",
                        genre: "Not Found",
                        duration: await getDurationSound(audioUrl),
                        size: file.size,
                        imgUrl: await formatImg(undefined),
                        audioUrl: audioUrl
                    } as Item
                    )
                }
            });
        });
    }

    async function setMusicList(filesAccepted: FileList | File[] | null, filesRejections: FileRejection[] | null) {
        try {
            const MusicsList = {
                accepted: [],
                rejection: []
            } as IList

            let sizeList = (list.accepted?.length ?? 0) + (list.rejection?.length ?? 0)
            let sizeMusicAccepted = sizeList + (filesAccepted?.length ?? 0 )

            if (filesAccepted) {
                let size = filesAccepted.length

                for (let i = 0; i < size; i++) MusicsList.accepted?.push(await getMetaDataAsync(filesAccepted[i], i + sizeList))
            }

            if (filesRejections) {
                let size2 = filesRejections.length
                //Adicionar FileAccepted como null depois
                for (let i = 0; i < size2; i++) MusicsList.rejection?.push({
                    item: await getMetaDataAsync(filesRejections[i].file, i + sizeMusicAccepted),
                    errors: filesRejections[i].errors
                })
            }

            if (list.accepted && list.rejection && MusicsList.accepted && MusicsList.rejection) {
                setList({
                    accepted: [...list.accepted, ...MusicsList.accepted],
                    rejection: [...list.rejection, ...MusicsList.rejection]
                })
            }

        } catch (error) {
            console.log(error)
        }
    }

    async function formatImg(picture: PictureType | undefined) {
        if (picture) {
            const { data, format } = picture;
            let base64String = "";
            for (let i = 0; i < data.length; i++) {
                base64String += String.fromCharCode(data[i]);
            }
            return `data:${format};base64,${window.btoa(base64String)}`;
        }
        let imgUrl = "https://img.freepik.com/vetores-gratis/ups-erro-404-com-ilustracao-de-conceito-de-robo-quebrado_114360-5529.jpg?w=2000"

        //Retirar Comentario !!!!
        await fetch("https://picsum.photos/600/600?grayscale&blur=2", { method: "GET" })
            .then(res => imgUrl = res.url)
            .catch(err => console.log(err))

        return imgUrl
    }

    function acceptItem(id: number) {

        let newListReject = { newArray: [], itemAccept: {} } as unknown as IAcceptItem

        list.rejection?.map(({ item, errors }) => {
            item.id === id ? newListReject.itemAccept = item : newListReject.newArray.push({ item, errors })
        })

        if (list.accepted)
            setList({
                accepted: [...list.accepted, newListReject.itemAccept],
                rejection: newListReject.newArray
            })
    }

    function setSoundstoFather(sounds:IList){
        if(sounds.accepted && sounds.accepted?.length > 0){
            setMusics(sounds.accepted)
        }
    }

    let newList = [] as JSX.Element[]

    if (Object.keys(list).length) {


        if (list.accepted) {
            newList = list.accepted.map(item => (
                <tr key={item.id} >
                    <td className={styles.bImg}>
                        <img src={item.imgUrl} alt={"Capa do álbum"} style={{ width: '100%' }} />
                    </td>
                    <td className={styles.bName} title={item.title}>
                        {item.title}
                    </td>
                    <td className={styles.bGenero} title={item.genre}>
                        {item.genre}
                    </td>
                    <td className={styles.bArtista} title={item.artist}>
                        {item.artist}
                    </td>
                    <td className={styles.bPlayer}>
                        📻
                    </td>
                </tr>
            ))
        }


        if (list.rejection?.length) {
            let headerReject = (
                <tr key={Math.random() * 9} style={{ display: 'flex' }}>
                    <th colSpan={5} scope="row" className={styles.lineDivide}>
                        <TbArrowBigDownLinesFilled />
                        Rejeitados
                        <TbArrowBigDownLinesFilled />
                    </th>
                </tr>
            )

            let listReject = list.rejection.map(({ item, errors }) => (
                <tr key={item.id} style={{ backgroundColor: "rgba(190, 18, 60, 0.3)" }}>
                    <td className={styles.bImg}>
                        <img src={item.imgUrl} alt={"Capa do álbum"} style={{ width: '100%' }} />
                    </td>
                    <td className={styles.bName} title={item.title}>
                        {item.title}
                    </td>
                    <td className={styles.bGenero} title={item.genre}>
                        {item.genre}
                    </td>
                    <td className={styles.bArtista} style={{ width: "10%", cursor: "help" }} title={errors.map(err => `- ${err.code}\n`).join("")}>
                        <BsExclamationCircleFill color='#be123c' size={20} />
                    </td>
                    <td className={styles.bPlayer} style={{ width: "20%" }}>
                        <button
                            type='button'
                            className={styles.btnAccepted}
                            onClick={() => acceptItem(item.id)}
                            title="Deseja passar este item para a lista de musicas aprovadas"
                        >
                            <BsFillFileEarmarkCheckFill />
                            Aceitar
                        </button>
                    </td>
                </tr>
            ))

            newList.push(headerReject)
            newList.push(...listReject)
        }

    }

    return (
        <section className={styles.container}>
           
            <main className={styles.main}>
                {list.accepted?.length || list.rejection?.length ? (
                    
                    <CaptureFiles setItems={setMusicList}>
                        <div className={styles.list}>

                            <table className={styles.table}>
                                <thead className={styles.thead}>
                                    <tr>
                                        <th className={styles.hImg}></th>
                                        <th className={styles.hName}>Nome</th>
                                        <th className={styles.hGenero}>Gênero</th>
                                        <th className={styles.hArtista}>Artista</th>
                                        <th className={styles.hPlayer}></th>
                                    </tr>
                                </thead>
                                <tbody className={styles.tbody}>
                                    {newList}
                                </tbody>

                            </table>

                        </div>
                        <div className={styles.footerList}>
                            <button type="button" className={styles.btnSave} onClick={() => setSoundstoFather(list)}><RiSave3Fill /> Salvar</button>
                            <button type="button" className={styles.btnClear} onClick={() => setList(MusicsList)}><RiDeleteBin5Fill/> Limpar</button>
                        </div>
                    </CaptureFiles>

                )
                    : <DropZone setItems={setMusicList} />
                }
            </main>
        </section>
    )
}

// type ActionType =
//     | { type: "change_state"; payload: IList }

// function listReducer(list: IList, { type, payload }: ActionType) {

// }