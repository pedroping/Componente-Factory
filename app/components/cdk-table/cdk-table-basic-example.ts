import {
  Component,
  Input,
  ComponentFactoryResolver,
  ComponentRef,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { DataSource, CdkTable, CdkRowDef } from '@angular/cdk/table';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';
import { PageEvent } from '@angular/material/paginator';

@Component({
  selector: 'app-inline-message',
  template: `
    <p>Detail: {{ user }}</p>
    <textarea style="width: 100%" rows="6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sollicitudin gravida tellus, nec faucibus sapien. Morbi et est nibh. Vivamus vestibulum sapien non blandit lacinia. In viverra lectus nulla, ut dignissim metus congue nec. Vivamus dictum dolor urna, et volutpat ante aliquet et. Sed maximus magna vitae massa ultrices iaculis. Quisque posuere, risus a egestas convallis, ipsum arcu fringilla libero, quis hendrerit ante neque eget nulla.</textarea>
  `,
  styles: [
    `
    :host {
      display: block;
      padding: 10px;
      color: red;
      background: rgba(0,0,0,0.1);
    }
  `,
  ],
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
  tablelength: number;
  @ViewChildren('row', { read: ViewContainerRef }) containers;

  expandedRow: number[] = [];

  constructor(private resolver: ComponentFactoryResolver) {}

  ngOnInit() {
    console.log(this.exampleDatabase.data);
    this.dataSource = new ExampleDataSource(this.exampleDatabase);
    this.tablelength = this.exampleDatabase.data.length;
    this.handlePageEvent({ pageIndex: 0, pageSize: 5, length: 100 });
  }

  expandRow(index: number) {
    if (this.expandedRow.indexOf(index) > -1) {
      this.containers.toArray()[index]?.clear();
      this.expandedRow = this.expandedRow.filter((x) => x != index);
      return;
    }
    this.expandedRow.push(index);
    const factory = this.resolver.resolveComponentFactory(
      InlineMessageComponent
    );
    const messageComponent = this.containers
      .toArray()
      [index]?.createComponent(factory);
    messageComponent.instance.user = this.exampleDatabase.data[index].name;
  }

  handlePageEvent(e: PageEvent) {
    const CopiedData = this.exampleDatabase.DefaultData;
    const index = e.pageIndex * e.pageSize;
    this.exampleDatabase.dataChange.next(
      CopiedData.slice(index, index + e.pageSize)
    );
  }
}

/** Constants used to fill up our data base. */
const COLORS = [
  'maroon',
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'purple',
  'fuchsia',
  'lime',
  'teal',
  'aqua',
  'blue',
  'navy',
  'black',
  'gray',
];
const NAMES = [
  'Maia',
  'Asher',
  'Olivia',
  'Atticus',
  'Amelia',
  'Jack',
  'Charlotte',
  'Theodore',
  'Isla',
  'Oliver',
  'Isabella',
  'Jasper',
  'Cora',
  'Levi',
  'Violet',
  'Arthur',
  'Mia',
  'Thomas',
  'Elizabeth',
];

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
  DefaultData: UserData[] = [];
  get data(): UserData[] {
    return this.dataChange.value;
  }

  constructor() {
    // Fill up the database with 100 users.
    for (let i = 0; i < 100; i++) {
      this.addUser();
    }
  }

  /** Adds a new user to the database. */
  addUser() {
    const copiedData = this.data.slice();
    copiedData.push(this.createNewUser());
    this.DefaultData = copiedData;
    this.dataChange.next(copiedData);
  }

  /** Builds and returns a new User. */
  public createNewUser() {
    const name =
      NAMES[Math.round(Math.random() * (NAMES.length - 1))] +
      ' ' +
      NAMES[Math.round(Math.random() * (NAMES.length - 1))].charAt(0) +
      '.';

    return {
      id: (this.data.length + 1).toString(),
      name: name,
      progress: Math.round(Math.random() * 100).toString(),
      color: COLORS[Math.round(Math.random() * (COLORS.length - 1))],
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
