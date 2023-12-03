import { Dropzone } from "dropzone"

const token = document.querySelector('meta[name="csrf-token"]').content

Dropzone.options.dictDefaultMessage = {
    dictDefaultMessage: "Sube aquí las imágenes",
    acceptedFiles: ".png, .jpg, .jpeg",
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: "Borrar imagen",
    dictMaxFilesExceeded: "El límite es 1 archivo",
    headers: {
        "CSRF-Token": token
    },
    paramName: "image",
    init: function() {
        const dropzone = this
        const btnPost = docuyment.querySelector("#post-property")

        btnPost.addEventListener("click", function(){
            dropzone.processQueue()
        })

        dropzone.on("queuecomplete", function(){
            if(dropzone.getActiveFiles().length == 0){
                window.location.href = "/my-properties"
            }
        })
    }
}