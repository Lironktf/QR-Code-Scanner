import { openDB } from 'idb';

const DB_NAME = 'qr-scanner-db';
const DB_VERSION = 1;

// Initialize IndexedDB
export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      // Events store
      if (!db.objectStoreNames.contains('events')) {
        const eventsStore = db.createObjectStore('events', { keyPath: 'id' });
        eventsStore.createIndex('created_at', 'created_at');
      }

      // QR Codes store
      if (!db.objectStoreNames.contains('qrcodes')) {
        const qrStore = db.createObjectStore('qrcodes', { keyPath: 'id' });
        qrStore.createIndex('event_id', 'event_id');
        qrStore.createIndex('scanned_at', 'scanned_at');
      }

      // Sync queue for offline operations
      if (!db.objectStoreNames.contains('sync_queue')) {
        db.createObjectStore('sync_queue', { keyPath: 'id', autoIncrement: true });
      }
    },
  });
};

// Events operations
export const dbEvents = {
  async getAll() {
    const db = await initDB();
    return db.getAll('events');
  },

  async add(event) {
    const db = await initDB();
    return db.add('events', event);
  },

  async update(event) {
    const db = await initDB();
    return db.put('events', event);
  },

  async delete(id) {
    const db = await initDB();
    return db.delete('events', id);
  },
};

// QR Codes operations
export const dbQRCodes = {
  async getAll(eventId) {
    const db = await initDB();
    const index = db.transaction('qrcodes').store.index('event_id');
    return index.getAll(eventId);
  },

  async add(qrCode) {
    const db = await initDB();
    return db.add('qrcodes', qrCode);
  },

  async update(qrCode) {
    const db = await initDB();
    return db.put('qrcodes', qrCode);
  },

  async delete(id) {
    const db = await initDB();
    return db.delete('qrcodes', id);
  },

  async deleteByEvent(eventId) {
    const db = await initDB();
    const qrCodes = await this.getAll(eventId);
    const tx = db.transaction('qrcodes', 'readwrite');
    await Promise.all(qrCodes.map(qr => tx.store.delete(qr.id)));
    await tx.done;
  },
};

// Sync queue operations
export const dbSyncQueue = {
  async add(operation) {
    const db = await initDB();
    return db.add('sync_queue', { ...operation, timestamp: Date.now() });
  },

  async getAll() {
    const db = await initDB();
    return db.getAll('sync_queue');
  },

  async delete(id) {
    const db = await initDB();
    return db.delete('sync_queue', id);
  },

  async clear() {
    const db = await initDB();
    return db.clear('sync_queue');
  },
};
