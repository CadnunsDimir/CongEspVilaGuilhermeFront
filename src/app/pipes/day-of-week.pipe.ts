import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dayOfWeek'
})
export class DayOfWeekPipe implements PipeTransform {

    transform(value: number, lang = 'es'): string {
        const daysOfWeek = {
            en: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            pt: ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'],
            es: ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']
        }[lang];

        if(!daysOfWeek) {
            throw new Error(`Language ${lang} not supported`);
        }

        return value < 0 || value > 6 ? 'NotAWeekDay': daysOfWeek[value];
    }

}