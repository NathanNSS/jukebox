import { ReactNode, useEffect } from 'react'
import { FileRejection, useDropzone } from 'react-dropzone'

import styles from './captureFilesStyles.module.css'

import { configDropZone } from '../../config';
import { RiFolderAddFill, RiDownload2Fill } from 'react-icons/ri';

type FilesAccepted = FileList | File[] | null

interface Props {
    setItems: (filesAccepted: FilesAccepted, fileRejections: FileRejection[] | null) => Promise<void>;
    children: ReactNode;
}

export function CaptureFiles({ setItems, children}: Props) {
    const {
        getRootProps,
        getInputProps,
        isFileDialogActive,
        acceptedFiles,
        fileRejections,
        isDragActive,
        isDragReject,
        open
    } = useDropzone({...configDropZone, noClick:true})

    function renderDragMessage(isDragActive: boolean, isDragReject: boolean) {
        if (!isDragActive && !isFileDialogActive) {
            return null;
         }

        if (isDragReject) { }
        
        if(isDragActive)
        return (
            <div className={styles.content}>
                <RiDownload2Fill/>
                <h2>Solte o Aquivo</h2>
            </div>
        );
    }

    useEffect(()=>{
        if (acceptedFiles.length > 0 || fileRejections.length > 0) {
            setItems(acceptedFiles, fileRejections)
        }
    },[acceptedFiles, fileRejections])

    return (
        <section {...getRootProps({ className: styles.container })}>
             <button className={styles.btnAddMusic} type="button" onClick={()=> open()}>
                <RiFolderAddFill />
                Adicionar Musicas
            </button>
            <input {...getInputProps({ multiple: true, capture: false })} />
                {renderDragMessage(isDragActive, isDragReject)}
                {children}
        </section>  
    )
}