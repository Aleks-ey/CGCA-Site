import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
// import { CalendarEvent } from './calendarEvent.model';
import { eventsAnimation } from './events-animation';

export interface CalendarEvent {
  id?: number;
  date: string;
  description: string;
  time: string;
  title: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
  animations: [eventsAnimation],
})

export class EventsComponent {
  selected: Date | null | undefined;

  event: CalendarEvent = {
    date: '',
    description: '',
    time: '',
    title: '',
  };

  eventsList: CalendarEvent[] = [];
  // selectedEventId?: number;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const result = await this.supabaseService.getAllEvents();
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } else {
      this.eventsList = result.data!;
      this.formatEventDates();
    }
  }

  formatEventDates() {
    this.eventsList = this.eventsList.map(event => {
        event.date = this.formatDate(event.date);
        return event;
    });
  }

  formatDate(dateString: string): string {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const [year, month, day] = dateString.split('-').map(Number);
    const formattedMonth = months[month - 1];
    const formattedDay = String(day).padStart(2, '0');
    return `${formattedMonth} ${formattedDay}, ${year}`;
}

  // ------------------ Event Slider ------------------
  currentEvent = 0;
  x = 0;
  cardx = 0;

  onPrevious() {
    const previousEvent = this.currentEvent - 1;
    this.currentEvent = previousEvent < 0 ? this.eventsList.length - 1 : previousEvent;
    console.log(this.currentEvent);

    if(this.cardx != 0) {
      this.x += 360;
      this.cardx -= 1;
    }
  }

  onNext() {
    const nextEvent = this.currentEvent + 1;
    this.currentEvent = nextEvent === this.eventsList.length ? 0 : nextEvent;
    console.log(this.currentEvent);


    if(window.innerWidth > 768) {
      if(this.cardx != this.eventsList.length-2) {
        this.x -= 360;
        this.cardx += 1;
      }
    }
    else {
      if(this.cardx != this.eventsList.length-1) {
        this.x -= 360;
        this.cardx += 1;
      }
    }
  }

  // ------------------ Event Selector ------------------
  onSelect(selected: Date | null | undefined) {

    if (!selected) {
      return 'Select a date to view events for that day.';
  }

    const dateObj = new Date(selected!);

    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dayOfWeek = daysOfWeek[dateObj.getUTCDay()];
    const month = months[dateObj.getUTCMonth()];
    const dayOfMonth = dateObj.getUTCDate();
    if(dayOfMonth == 1 || dayOfMonth == 2 || dayOfMonth == 3 || dayOfMonth == 4 || dayOfMonth == 5 || dayOfMonth == 6 || dayOfMonth == 7 || dayOfMonth == 8 || dayOfMonth == 9) {
      const dayOfMonthString = String(dayOfMonth).padStart(2, '0');
      this.showSelectedEvents(`${month} ${dayOfMonthString}, ${dateObj.getUTCFullYear()}`);
      return `${dayOfWeek}, ${month} ${dayOfMonthString}, ${dateObj.getUTCFullYear()}`;
    }

    const year = dateObj.getUTCFullYear();

    this.showSelectedEvents(`${month} ${dayOfMonth}, ${year}`);

    return `${dayOfWeek}, ${month} ${dayOfMonth}, ${year}`;
  }

  selectedEventsList: CalendarEvent[] = [];

  showSelectedEvents(date: string) {
    this.selectedEventsList = [];
    for(let i = 0; i < this.eventsList.length; i++) {
      if(this.eventsList[i].date == date) {
        this.selectedEventsList.push(this.eventsList[i]);
      }
    }
    return this.selectedEventsList;
  }
}
