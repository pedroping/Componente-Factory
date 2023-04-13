import {Component, Input, ComponentFactoryResolver, ComponentRef, ViewChildren, ViewContainerRef} from '@angular/core';
import {DataSource, CdkTable, CdkRowDef} from '@angular/cdk/table';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-inline-message',
  template: 'Detail: {{ user }}',
  styles: [`
    :host {
      display: block;
      padding: 24px;
      color: red;
      background: rgba(0,0,0,0.1);
    }
  `]
})
export class InlineMessageComponent {
  @Input() user: string;
}



@Component({
  selector: 'cdk-table-basic-example',
  styleUrls: ['cdk-table-basic-example.css'],
  templateUrl: 'cdk-table-basic-example.html',
})
export class CdkTableBasicExample {
  displayedColumns = ['userId', 'userName', 'progress', 'color'];
  exampleDatabase = new ExampleDatabase();
  dataSource: ExampleDataSource | null;
  
  @ViewChildren('cdkrow', { read: ViewContainerRef }) containers;

  expandedRow: number;
  
  constructor(private resolver: ComponentFactoryResolver) {
    
  }

  ngOnInit() {
    this.dataSource = new ExampleDataSource(this.exampleDatabase);
  }
  
  expandRow(index: number) {
    
    if (this.expandedRow != null) {
      // clear old message
      this.containers.toArray()[this.expandedRow].clear();
    }
    
    if (this.expandedRow === index) {
      this.expandedRow = null;
    } else {
      const container = this.containers.toArray()[index];
      console.log('container', container);
      const factory: ComponentFactory = this.resolver.resolveComponentFactory(InlineMessageComponent);
      const messageComponent = container.createComponent(factory);
      
      messageComponent.instance.user = this.exampleDatabase.data[index].name;
      this.expandedRow = index;
    }
  }
}

/** Constants used to fill up our data base. */
const COLORS = ['maroon', 'red', 'orange', 'yellow', 'olive', 'green', 'purple',
  'fuchsia', 'lime', 'teal', 'aqua', 'blue', 'navy', 'black', 'gray'];
const NAMES = ['Maia', 'Asher', 'Olivia', 'Atticus', 'Amelia', 'Jack',
  'Charlotte', 'Theodore', 'Isla', 'Oliver', 'Isabella', 'Jasper',
  'Cora', 'Levi', 'Violet', 'Arthur', 'Mia', 'Thomas', 'Elizabeth'];

export interface UserData {
  id: string;
  name: string;
  progress: string;
  color: string;
}

/** An example database that the data source uses to retrieve data for the table. */
export class ExampleDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<UserData[]> = new BehaviorSubject<UserData[]>([]);
  get data(): UserData[] { return this.dataChange.value; }

  constructor() {
    // Fill up the database with 100 users.
    for (let i = 0; i < 100; i++) { this.addUser(); }
  }

  /** Adds a new user to the database. */
  addUser() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewUser());
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  private createNewUser() {
    const name =
        NAMES[Math.round(Math.random() * (NAMES.length - 1))] + ' ' +
        NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) + '.';

    return {
      id: (this.data.length + 1).toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))]
    };
  }
}

/**
 * Data source to provide what data should be rendered in the table. Note that the data source
 * can retrieve its data in any way. In this case, the data source is provided a reference
 * to a common data base, ExampleDatabase. It is not the data source's responsibility to manage
 * the underlying data. Instead, it only needs to take the data and send the table exactly what
 * should be rendered.
 */
export class ExampleDataSource extends DataSource<any> {
  constructor(private _exampleDatabase: ExampleDatabase) {
    super();
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<UserData[]> {
    return this._exampleDatabase.dataChange;
  }

  disconnect() {}
}


/**  Copyright 2017 Google Inc. All Rights Reserved.
    Use of this source code is governed by an MIT-style license that
    can be found in the LICENSE file at http://angular.io/license */