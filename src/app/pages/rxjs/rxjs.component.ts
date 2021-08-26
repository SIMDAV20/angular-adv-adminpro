import { Component, OnDestroy } from '@angular/core';
import { Observable, interval, Subscription } from 'rxjs';
import { retry, take, map, filter } from 'rxjs/operators';

@Component({
  selector: 'app-rxjs',
  templateUrl: './rxjs.component.html',
  styles: [
  ]
})
export class RxjsComponent implements OnDestroy  {

  public intervalSubs: Subscription;

  constructor() {

    // this.retornaObservable().pipe(
    //   // conectarlo con una manguera
    //   retry(1) // intentar una sola vez
    // ).subscribe(
    //   valor => console.log('subs', valor),
    //   error => console.warn('Error', error),
    //   () => console.info('Obs terminado')
    // );
    this.intervalSubs = this.retornaIntervalo().subscribe(console.log)
  }

  ngOnDestroy(): void {
    this.intervalSubs.unsubscribe();
  }

  retornaObservable(): Observable<number>{
    let i = -1; // i mantenga su valor

    const obs$ = new Observable<number>( observer => {

      const intervalo = setInterval( () => {

        i++;
        observer.next(i)

        if (i === 4) {
          clearInterval( intervalo );
          observer.complete();
        }

        if (i === 2) {
          // console.log('i = 2...error');
          // i = 0;
          observer.error('i llego al valor de 2');
        }

      }, 1000)
    });

    return obs$;
  }

  retornaIntervalo(): Observable<number> {
    return interval(100)
                        .pipe(
                          take(10),
                          map( valor => valor + 1), // transforma la data que envia la funcion
                          filter( valor => ( valor % 2 === 0 )? true : false ),
                        );
  }

}
