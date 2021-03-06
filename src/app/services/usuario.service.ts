import { Injectable, NgZone } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap, map, catchError, delay } from "rxjs/operators";
import { Observable, of } from 'rxjs';

import { environment } from './../../environments/environment';

import { RegisterForm } from './../interfaces/register-form.interface';
import { LoginForm } from '../interfaces/login-form.interface';
import { CargarUsuario } from '../interfaces/cargar-usuarios.interface';

import { Router } from '@angular/router';
import { Usuario } from './../models/usuario.model';

const base_url = environment.base_url;

declare const gapi: any

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  public auth2: any;
  public usuario: Usuario;

  constructor( private http: HttpClient,
                private router: Router,
                private ngZone: NgZone) {

    this.googleInit();
  }

  get token(): string { // lo puedo llamar con un this
    return localStorage.getItem('token') || '';
  }

  get uid() {
    return this.usuario.uid || '';
  }

  get headers() {
    return {
      headers: {
        'x-token': this.token
      }
    }
  }

  logout() {
    localStorage.removeItem('token');

    this.auth2.signOut()
      .then(() => {
        this.ngZone.run(() => {
          this.router.navigateByUrl('/login');
        })
      });
  }

  googleInit() {

    return new Promise<void>( resolve => {

      gapi.load('auth2', () => {
        this.auth2 = gapi.auth2.init({
          client_id: '686560310210-m5ftor1u242ligsfh2707n0c58ifoqa1.apps.googleusercontent.com',
          cookiepolicy: 'single_host_origin',
        });

        resolve();
      });

    })
  }

  validarToken(): Observable<boolean> { // pasa por el guard, entonces siempre tengo el modelo usuario como una variable global en todo mi proyecto

    return this.http.get(`${ base_url }/login`, {
      headers: {
        'x-token': this.token
      }
    }).pipe(
      map( (resp: any) => {
        // console.log(resp);
        // this.usuario = resp.usuario;
        const { email, google, nombre, role, img = '', uid } = resp.usuario;
        this.usuario = new Usuario( nombre, email, '', img, google, role, uid );

        localStorage.setItem('token', resp.token );
        return true
      }),
      // map( resp => true ),
      catchError(  error => of(false) )
    );


  }

  crearUsuario( formData: RegisterForm ) {
    return this.http.post(`${ base_url }/usuarios`, formData)
      .pipe(
        tap( (resp: any) => {
          localStorage.setItem('token', resp.token)
        })
      );
  }

  actualizarPerfil( data: { email: string, nombre: string, role: string }) {
    data = {
      ...data,
      role: this.usuario.role
    }

    return this.http.put(`${ base_url }/usuarios/${ this.uid }`, data, this.headers);
  }

  login( formData: LoginForm) {
    return this.http.post(`${ base_url }/login`, formData)
    .pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token)
      })
    );
  }

  loginGoogle( token ) {
    return this.http.post(`${ base_url }/login/google`, { token })
    .pipe(
      tap( (resp: any) => {
        localStorage.setItem('token', resp.token)
      })
    );
  }

  cargarUsuarios(desde: number = 0) {
    const url = `${ base_url }/usuarios?desde=${ desde }`;
    return this.http.get<CargarUsuario>( url , this.headers )
      .pipe(
        // delay(5000),
        map( resp => {
          // console.log(resp);
          const usuarios = resp.usuarios.map(
            user => new Usuario( user.nombre, user.email, '', user.img, user.google, user.role, user.uid ));
          return {
            total: resp.total,
            usuarios
          }
        })
      )
  }

  eliminarUsuario( usuario: Usuario ) {
    const url = `${ base_url }/usuarios/${ usuario.uid }`
    return this.http.delete( url, this.headers );
  }

  guardarUsuario( usuario: Usuario) {
    return this.http.put(`${ base_url }/usuarios/${ usuario.uid }`, usuario, this.headers);
  }
}
