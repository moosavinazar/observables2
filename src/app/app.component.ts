import {Component, OnInit} from '@angular/core';
import {Observable, shareReplay} from "rxjs";
import {map, filter} from "rxjs/operators";
import {Todo} from "./models/models";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  public http$!: Observable<Todo[]>;
  public doneTasks$!: Observable<Todo[]>;
  public undoneTasks$!: Observable<Todo[]>;

  ngOnInit(): void {

    this.http$ = new Observable<Todo[]>((observer) => {
      fetch('https://jsonplaceholder.typicode.com/todos')
        .then((response) => {
          return response.json();
        })
        .then((body) => {
          observer.next(body);
          observer.complete();
        })
        .catch((err) => {
          observer.error(err);
        });
    });

    this.http$ = this.http$.pipe(
      shareReplay()
    );

    this.doneTasks$ = this.http$.pipe(
      map((todo) => todo.filter((todo) => todo.completed === true))
    );

    this.undoneTasks$ = this.http$.pipe(
      map((todo) => todo.filter((todo) => todo.completed === true))
    );

    // Wrong way
    /*this.http$.subscribe((val) => {
      this.doneTasks = val.filter(todo => todo.completed === true);
      this.undoneTasks = val.filter(todo => todo.completed === false);
    });*/

  }

}
