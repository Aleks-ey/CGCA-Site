import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { CalendarEvent } from './calendarEvent.model';
import { eventsAnimation } from './events-animation';

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
  selectedEventId?: number;

  constructor(private supabaseService: SupabaseService) {}

  async ngOnInit() {
    const result = await this.supabaseService.getAllEvents();
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } else {
      this.eventsList = result.data!;
    }
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
}
