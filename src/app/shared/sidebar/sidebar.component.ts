import { UsuarioService } from './../../services/usuario.service';
import { Component, OnInit } from '@angular/core';
import { SidebarService } from 'src/app/services/sidebar.service';
import { Usuario } from 'src/app/models/usuario.model';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styles: [
  ]
})
export class SidebarComponent implements OnInit {

  public menuItems: any[];

  public usuario: Usuario;

  constructor(private sidebarService: SidebarService,
              private usuarioService: UsuarioService) {
    this.menuItems = sidebarService.menu;
  }

  ngOnInit(): void {
    this.usuario = this.usuarioService.usuario;
  }

}
