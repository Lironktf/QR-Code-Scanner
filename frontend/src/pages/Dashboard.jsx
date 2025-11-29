import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventAPI } from '../utils/api';
import { dbEvents } from '../utils/db';
import { toast } from '../utils/toast';
import './Dashboard.css';

const Dashboard = ({ user, onLogout }) => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showNewEventModal, setShowNewEventModal] = useState(false);
  const [newEventName, setNewEventName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    setLoading(true);
    try {
      // Try to fetch from API
      const response = await eventAPI.getEvents();
      const fetchedEvents = response.data.events;
      setEvents(fetchedEvents);

      // Sync with IndexedDB
      for (const event of fetchedEvents) {
        await dbEvents.update(event);
      }
    } catch (error) {
      // If offline, load from IndexedDB
      console.log('Loading events from IndexedDB');
      const localEvents = await dbEvents.getAll();
      setEvents(localEvents);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (e) => {
    e.preventDefault();
    if (!newEventName.trim()) return;

    try {
      const response = await eventAPI.createEvent(newEventName);
      const newEvent = response.data.event;

      // Add to state and IndexedDB
      setEvents([newEvent, ...events]);
      await dbEvents.add(newEvent);

      toast.success('Event created');
      setNewEventName('');
      setShowNewEventModal(false);
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const deleteEvent = async (eventId, eventName) => {
    if (!confirm(`Delete event "${eventName}"?`)) return;

    try {
      await eventAPI.deleteEvent(eventId);
      setEvents(events.filter((e) => e.id !== eventId));
      await dbEvents.delete(eventId);
      toast.success('Event deleted');
    } catch (error) {
      toast.error('Failed to delete event');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="flex justify-between items-center">
            <h1>QR Scanner</h1>
            <button onClick={onLogout} className="btn btn-secondary">
              Logout
            </button>
          </div>
          <p className="text-secondary mt-1">{user?.email}</p>
        </div>
      </div>

      {/* Content */}
      <div className="container">
        <button
          onClick={() => setShowNewEventModal(true)}
          className="btn btn-primary btn-large w-full new-event-btn"
        >
          + New Event
        </button>

        {loading ? (
          <div className="flex justify-center mt-2">
            <div className="spinner"></div>
          </div>
        ) : events.length === 0 ? (
          <div className="empty-state">
            <p>No events yet</p>
            <p className="text-secondary">Create your first event to start scanning QR codes</p>
          </div>
        ) : (
          <div className="events-list">
            {events.map((event) => (
              <div
                key={event.id}
                className="event-card card"
                onClick={() => navigate(`/event/${event.id}`)}
              >
                <div className="event-card-content">
                  <h3>{event.name}</h3>
                  <p className="text-secondary">{formatDate(event.created_at)}</p>
                  <p className="event-qr-count">{event.qr_count || 0} QR codes</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteEvent(event.id, event.name);
                  }}
                  className="btn btn-danger event-delete-btn"
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* New Event Modal */}
      {showNewEventModal && (
        <div className="modal-overlay" onClick={() => setShowNewEventModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>New Event</h2>
            <form onSubmit={createEvent}>
              <input
                type="text"
                value={newEventName}
                onChange={(e) => setNewEventName(e.target.value)}
                placeholder="Event name"
                autoFocus
                required
              />
              <div className="modal-actions">
                <button type="button" onClick={() => setShowNewEventModal(false)} className="btn btn-secondary">
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
