import { Pipe, PipeTransform } from '@angular/core';

/**
 * FilterPipe is currently **DEPRECATED** for this project.
 * Made obsolete by server-side pagination. FilterPipe filters
 * arrays by whether they have a specified property that
 * matches a specified string.
 */
@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  /**
   * Filters array, based on whether items have a string
   * at a specified property that matches a provided string.
   * 
   * @param value - Array of objects to be filtered
   * @param filterString - Provided string to match/filter out items
   * @param property - Property at which to match the string
   * @returns - Filtered array of objects
   */
  transform(value: any, filterString: string, property: string) {
    if (value.length === 0 || !filterString) {
      return value;
    }
    let filteredData: any = [];
    for (let datum of value) {
      // push if match found, ignoring case
      if (datum[property].toUpperCase().includes(filterString.toUpperCase())) {
        filteredData.push(datum);
      }
    }
    return filteredData;
  }

}
