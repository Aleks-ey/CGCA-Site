import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
// import { CalendarEvent } from './calendarEvent.model';
import { MatCalendarCellCssClasses } from '@angular/material/datepicker';

export interface CalendarEvent {
  id?: number;
  date: string;
  description: string;
  time: string;
  title: string;
  img_url: string;
}

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css'],
})

export class EventsComponent {
  selected: Date | null = null;

  event: CalendarEvent = {
    date: '',
    description: '',
    time: '',
    title: '',
    img_url: '',
  };

  eventsList: CalendarEvent[] = [];
  eventDates: Set<string> = new Set();
  // selectedEventId?: number;
  sliderEventsList: CalendarEvent[] = [];

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const result = await this.supabaseService.getAllEvents();
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } else {
      this.eventsList = result.data!.map(event => ({
        ...event,
        date: this.formatDate(event.date),
        time: this.formatTime(event.time)
      }));
      this.eventDates = new Set(this.eventsList.map(event => event.date));

      // Sort eventsList and put any events that are 1 week before the current date and 2 months after the current date into the sliderEventsList
      const currentDate = new Date();
      const twoMonthsAfter = new Date(currentDate);
      twoMonthsAfter.setMonth(twoMonthsAfter.getMonth() + 2);
      currentDate.setDate(currentDate.getDate() - 1);

      this.eventsList.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
      this.sliderEventsList = this.eventsList.filter(event => {
        const eventDate = new Date(event.date);
        return eventDate >= currentDate && eventDate <= twoMonthsAfter;
      });
    }
  }

  myDateClass = (date: Date): MatCalendarCellCssClasses => {
    const formattedDate = this.formatDate(date.toISOString().split('T')[0]);
    const hasEvent = this.eventDates.has(formattedDate);
    return hasEvent ? 'has-event' : '';
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
  currentSliderEvent = 0;
  x = 0;
  cardx = 0;
  
  onPrevious() {
    const previousEvent = this.currentSliderEvent - 1;
    this.currentSliderEvent = previousEvent < 0 ? this.eventsList.length - 1 : previousEvent;

    if(this.cardx != 0) {
      this.x += 360;
      this.cardx -= 1;
    }
  }

  onNext() {
    const nextEvent = this.currentSliderEvent + 1;
    this.currentSliderEvent = nextEvent === this.eventsList.length ? 0 : nextEvent;

    if(window.innerWidth > 768) {
      if(this.cardx != this.sliderEventsList.length-2 && this.sliderEventsList.length > 1) {
        this.x -= 360;
        this.cardx += 1;
      }
    }
    else {
      if(this.cardx != this.sliderEventsList.length-1 && this.sliderEventsList.length > 1) {
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

  formatTime(timeString: string): string {
    // Check if timeString is valid and has the expected format "HH:MM"
    if (!timeString || !timeString.includes(':')) {
      return timeString; // or you could return an error or a default value
    }
  
    const [hours, minutes] = timeString.split(':').map(Number);
    const period = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12; // Convert to 12-hour format and handle midnight
  
    return `${hours12}:${minutes.toString().padStart(2, '0')} ${period}`;
  }
  
}
