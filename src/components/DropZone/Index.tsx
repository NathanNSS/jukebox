import { useDropzone, DropzoneOptions, FileRejection,  } from 'react-dropzone'
import { HiArchiveBox, HiArchiveBoxArrowDown, HiArchiveBoxXMark } from 'react-icons/hi2'
import { configDropZone } from '../../config'

import styles from "./dropzoneStyles.module.css"

type FilesAccepted = FileList | File[] | null


interface Props {
    setItems: (filesAccepted:FilesAccepted, fileRejections: FileRejection[] | null) => Promise<void>
}




export function DropZone({ setItems }: Props) {

    const { getRootProps, getInputProps, acceptedFiles, isDragActive, isDragReject, isFileDialogActive, fileRejections} = useDropzone(configDropZone);
    

    function renderDragMessage(isDragActive: boolean, isDragReject: boolean) {
        if (!isDragActive && !isFileDialogActive) {
            return (
                <div className={styles.description}>
                    <HiArchiveBox /><br />
                    <span className={styles.text}>
                        
                    </span>
                </div>
            );
        }

        if (isDragReject) {
            return (
                <div className={styles.description}>
                    <HiArchiveBoxXMark color='#be123c'/><br />
                    <span>
                        Arquivo não suportado
                    </span>
                </div>
            );
        }
        
        return (
            <div className={styles.description}>
                <HiArchiveBoxArrowDown color='#16a34a'/><br />
                <span>
                    Solte seu arquivo de música aqui
                </span>
            </div>
        );
    }

    if (acceptedFiles.length > 0 || fileRejections.length > 0) {
        setItems(acceptedFiles, fileRejections)
    }

    return (
        <section className={styles.container}>
            <div {...getRootProps({ className: styles.content })}>
                <input {...getInputProps({ multiple: true, capture:false})} />

                {renderDragMessage(isDragActive, isDragReject)}
            </div>

        </section>
    )
}