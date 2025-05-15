import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  transform(items: any[], search: string, field: string | undefined = undefined): any[] {
    if (!items || !search) {
      return items;
    }
    return items.filter(item => {
      const data = field ? item[field] : item;
      return data.toString().toLowerCase().includes(search.toString().toLowerCase());
    });
  }
}