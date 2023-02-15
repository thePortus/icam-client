import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(value: any, filterString: string, property: string) {
    if (value.length === 0 || !filterString) {
      return value;
    }
    let filteredData: any = [];
    for (let datum of value) {
      if (datum[property].toUpperCase().includes(filterString.toUpperCase())) {
        filteredData.push(datum);
      }
    }
    return filteredData;
  }

}
