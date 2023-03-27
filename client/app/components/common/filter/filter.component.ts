import { Component, OnInit, Output, EventEmitter, Input, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnInit {
  // event emitters
  @Output() filterUpdated = new EventEmitter<string>();
  @Output() displayToggled = new EventEmitter<boolean>();
  // list of fields, each defined as object w key and label of each field
  // e.g. [{ keyword: 'title', label: 'Title' }, {...}]
  @Input() fields: any[] = [];

  protectedData: any = {};
  isHidden: boolean = true;

  constructor() { }

  /**
   * Builds empty fields for input
   */
  ngOnInit(): void {
    this.clearInputFields();
  }

  /**
   * On component changes, re-build empty fields for input.
   * 
   * @param changes - Data on nature of component changes (unnecessary)
   */
  ngOnChanges(changes: SimpleChanges) {
    this.clearInputFields();
  }

  /**
   * Clears protectedData and uses .fields to recreate empty inputs at each keyword
   */
  clearInputFields() {
    this.protectedData = {};
    for (let field of this.fields) {
      this.protectedData[field.keyword] = '';
    }
  }

  /**
   * Upon update of input field, emits new data.
   */
  updateFilter() {
    this.filterUpdated.emit(this.protectedData);
  }

  /**
   * Toggles the display of filter fields and emits
   * display status.
   */
  toggleDisplay() {
    this.isHidden = !this.isHidden;
    this.displayToggled.emit(this.isHidden);
  }

}
