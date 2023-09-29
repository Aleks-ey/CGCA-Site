import { trigger, style, animate, transition, state } from '@angular/animations';

export const eventsAnimation = trigger('eventsAnimation', [
    transition('void => *', [
        style({ opacity: 0, transform: 'translateX(20px)' }),
        animate('300ms', style({ opacity: 1 }))
    ]),
    transition('* => void', [
        animate('300ms', style({ opacity: 0, transform: 'translateX(-20px)' }))
    ])
]);
