import { Pipe, PipeTransform } from '@angular/core';

const formatter = new Intl.NumberFormat('en-IN', {
  style: 'currency',
  currency: 'INR',
  maximumFractionDigits: 0,
});

@Pipe({ name: 'inr' })
export class InrPipe implements PipeTransform {
  transform(value: number | null | undefined): string {
    return formatter.format(value ?? 0);
  }
}
