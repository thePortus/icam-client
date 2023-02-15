import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterTwoLayer'
})
export class FilterTwoLayerPipe implements PipeTransform {

  transform(value: any, filterString: string, propertyA: string, propertyB: string) {
    if (value.length === 0 || !filterString) {
      return value;
    }
    let filteredData: any = [];
    for (let datum of value) {
      if (datum[propertyA][propertyB].toUpperCase().includes(filterString.toUpperCase())) {
        filteredData.push(datum);
      }
    }
    return filteredData;
  }

}
