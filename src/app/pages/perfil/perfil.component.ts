import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';

import { UsuarioService } from './../../services/usuario.service';
import { FileUploadService } from 'src/app/services/file-upload.service';

import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.component.html',
  styles: [
  ]
})
export class PerfilComponent implements OnInit {

  public perfilForm: FormGroup;

  public usuario: Usuario;

  public imagenSubir: File;

  public imgTemp: any = null;

  constructor( private fb: FormBuilder,
                private usuarioService: UsuarioService,
                private fileUploadService: FileUploadService) { }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;

    this.perfilForm = this.fb.group({
      nombre: [ this.usuario.nombre, Validators.required ],
      email:  [ this.usuario.email, [Validators.required, Validators.email ] ],
    })
  }

  actualizarPerfil() {
    this.usuarioService.actualizarPerfil( this.perfilForm.value )
      .subscribe(
        () => { // me viene la informacion del usuario
          const { nombre, email } = this.perfilForm.value
          this.usuario.nombre = nombre;
          this.usuario.email = email;

          Swal.fire('Guardado', 'Cambios fueron guardados', 'success');

        }, err => {

          Swal.fire('Error', err.error.msg, 'error')
          console.log(err.error.msg);

        }
      )
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
    this.fileUploadService.actualizarFoto( this.imagenSubir, 'usuarios', this.usuario.uid )
      .then( img => {
        this.usuario.img = img
        Swal.fire('Guardado', 'La Imagen fue guardada', 'success');
      })
      .catch( err => {
        Swal.fire('Error', err.error.msg , 'error');
      });
  }

}
