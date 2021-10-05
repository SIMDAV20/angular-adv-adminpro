import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { FileUploadService } from './../../services/file-upload.service';
import { ModalImagenService } from './../../services/modal-imagen.service';


@Component({
  selector: 'app-modal-imagen',
  templateUrl: './modal-imagen.component.html',
  styles: [
  ]
})
export class ModalImagenComponent implements OnInit {

  public imagenSubir: File;

  public imgTemp: any = null;

  constructor( public modalImagenService: ModalImagenService,
                private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
  }

  cerrarModal() {
    this.modalImagenService.cerrarModal();
    this.imgTemp = null;
  }

  cambiarImgen( file: File ) {
    this.imagenSubir = file;

    if ( !file ) {
      return this.imgTemp = null;
    }

    const reader = new FileReader();

    reader.readAsDataURL( file ); // urlbase 64

    reader.onloadend = () => {
      this.imgTemp = reader.result;
    }

  }

  subirImagen() {

    const id = this.modalImagenService.id;
    const tipo = this.modalImagenService.tipo;

    this.fileUploadService.actualizarFoto( this.imagenSubir, tipo, id )
      .then( img => {
        Swal.fire('Guardado', 'La Imagen fue guardada', 'success');

        this.modalImagenService.nuevaImagen.emit(img); // Observable

        this.cerrarModal();
      })
      .catch( err => {
        Swal.fire('Error', err.error.msg , 'error');
      });
  }
}
