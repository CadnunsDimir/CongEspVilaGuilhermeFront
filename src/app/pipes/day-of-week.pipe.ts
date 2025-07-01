import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dayOfWeek'
})
export class DayOfWeekPipe implements PipeTransform {

    transform(value: any, lang = 'es'): string {
        const daysOfWeek = {
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday','Sunday'],
            pt: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado', 'Domingo'],
            es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
        }[lang];

        if(!daysOfWeek) {
            throw new Error(`Language ${lang} not supported`);
        }

        if (typeof value == 'string') {
            value = new Date(Date.parse(value)).getDay() + 1;
        }

        return value < 0 || value > 7 ? 'NotAWeekDay': daysOfWeek[value];
    }

}