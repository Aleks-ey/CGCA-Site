import { Component } from '@angular/core';
import { SupabaseService } from 'src/app/supabase.service';
import { CalendarEvent } from './calendarEvent.model';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css'],
})
export class AdminComponent {
  event: CalendarEvent = {
    date: '',
    description: '',
    time: '',
    title: '',
  };

  eventsList: CalendarEvent[] = [];
  selectedEventId?: number;

  constructor(private supabaseService: SupabaseService) {}

  async onSubmit() {
    const result = await this.supabaseService.addEvent(this.event);
    if (result.error) {
      console.error('Error inserting data:', result.error);
    } else {
      console.log('Event added successfully!');

      await this.fetchEvents();

      this.event = {
        date: '',
        description: '',
        time: '',
        title: ''
      };
    }
  }

  async fetchEvents() {
    const { data, error } = await this.supabaseService.getAllEvents();
    if (error) {
      console.error('Error fetching events:', error);
    } else {
      this.eventsList = data || [];
    }
}

  async ngOnInit() {
    const result = await this.supabaseService.getAllEvents();
    if (result.error) {
      console.error('Error fetching events:', result.error);
    } else {
      this.eventsList = result.data!;
    }
  }

  async deleteEvent() {
    if (this.selectedEventId) {
      const result = await this.supabaseService.deleteEvent(
        this.selectedEventId
      );
      if (result.error) {
        console.error('Error deleting event:', result.error);
      } else {
        console.log('Event deleted successfully!');
        // Remove the deleted event from the eventsList
        this.eventsList = this.eventsList.filter(event => event.id !== this.selectedEventId);
        this.selectedEventId = undefined;
      }
    }
  }
}
