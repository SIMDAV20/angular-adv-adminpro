import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-incrementador',
  templateUrl: './incrementador.component.html',
  styles: [
  ]
})
export class IncrementadorComponent implements OnInit {

  // @Input() progreso:number = 30;
  @Input('valor') progreso:number = 30;
  @Input() btnClass:string = 'btn btn-primary';

  @Output() valorSalida = new EventEmitter<number>();

  get getPorcentaje() {
    return `${ this.progreso }%`;
  }

  cambiarValor( valor: number ) {
    if ( this.progreso >= 100 && valor > 0) {
      this.valorSalida.emit(100);
      return this.progreso = 100;
    }

    if ( this.progreso <= 0 && valor < 0) {
      this.valorSalida.emit(0);
      return this.progreso = 0;
    }

    this.progreso = this.progreso + valor;
    this.valorSalida.emit( this.progreso );
  }

  onChange( nuevoValor: number ) {
    if ( nuevoValor >= 100) {
      this.progreso  = 100;
    } else if ( nuevoValor <= 0) {
      this.progreso = 0
    } else {
      this.valorSalida.emit( nuevoValor );
    }

  }
  constructor() { }

  ngOnInit(): void {
    this.btnClass = `btn ${ this.btnClass }`;
  }

}
