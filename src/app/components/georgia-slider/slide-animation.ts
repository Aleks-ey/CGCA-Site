import { trigger, style, animate, transition, state } from '@angular/animations';

// export const slideAnimation = trigger('slideAnimation', [
//   state('center', style({
//     transform: 'translateX(0%)'
//   })),
//   state('left', style({
//     transform: 'translateX(-100%)'
//   })),
//   state('right', style({
//     transform: 'translateX(100%)'
//   })),
//   transition('* <=> *', [
//     animate('300ms ease-in-out')
//   ])
// ]);

export const slideAnimation = trigger('slideAnimation', [
  state('center', style({
    transform: 'translateX(0%)',
    opacity: 1,
  })),
  state('left', style({
    transform: 'translateX(-100%)',
    opacity: 0,
  })),
  state('right', style({
    transform: 'translateX(100%)',
    opacity: 0,
  })),
  transition('* <=> *', animate('300ms ease-in-out'))
]);

export const nextSlideAnimation = trigger('nextSlideAnimation', [
  state('center', style({
    transform: 'translateX(0%)',
    opacity: 0,
  })),
  state('left', style({
    transform: 'translateX(100%)',
    opacity: 1,
  })),
  state('right', style({
    transform: 'translateX(-100%)',
    opacity: 1,
  })),
  transition('* <=> *', animate('300ms ease-in-out'))
]);



