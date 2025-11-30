"""
MongoDB Database Configuration and Models
"""
import os
import certifi
from pymongo import MongoClient
from datetime import datetime
from bson import ObjectId

# MongoDB connection
MONGODB_URI = os.getenv('MONGODB_URI', 'mongodb://localhost:27017/')
DATABASE_NAME = 'freshmen_helper'

# Initialize MongoDB client
client = None
db = None

def init_db():
    """Initialize MongoDB connection"""
    global client, db
    try:
        # Use certifi for SSL certificate validation
        client = MongoClient(
            MONGODB_URI,
            tlsCAFile=certifi.where(),
            serverSelectionTimeoutMS=5000,
            connectTimeoutMS=10000,
            socketTimeoutMS=10000
        )
        db = client[DATABASE_NAME]

        # Test connection
        client.admin.command('ping')

        # Create indexes for better performance
        db.users.create_index('email', unique=True)
        db.events.create_index('user_email')
        db.qr_codes.create_index('event_id')
        db.qr_codes.create_index([('event_id', 1), ('content', 1)], unique=True)

        print(f"✓ Connected to MongoDB: {DATABASE_NAME}")
        return db
    except Exception as e:
        print(f"✗ MongoDB connection failed: {str(e)}")
        raise

def get_db():
    """Get database instance"""
    global db
    if db is None:
        init_db()
    return db

# Helper function to convert ObjectId to string
def serialize_doc(doc):
    """Convert MongoDB document to JSON-serializable dict"""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]

    doc['id'] = str(doc.pop('_id'))
    return doc

# User operations
class UserDB:
    @staticmethod
    def create(email, password_hash):
        """Create a new user"""
        db = get_db()
        user = {
            'email': email,
            'password': password_hash,
            'created_at': datetime.utcnow().isoformat()
        }
        result = db.users.insert_one(user)
        user['_id'] = result.inserted_id
        return serialize_doc(user)

    @staticmethod
    def find_by_email(email):
        """Find user by email"""
        db = get_db()
        user = db.users.find_one({'email': email})
        return serialize_doc(user) if user else None

    @staticmethod
    def exists(email):
        """Check if user exists"""
        db = get_db()
        return db.users.count_documents({'email': email}) > 0

# Event operations
class EventDB:
    @staticmethod
    def create(name, user_email):
        """Create a new event"""
        db = get_db()
        event = {
            'name': name,
            'user_email': user_email,
            'created_at': datetime.utcnow().isoformat()
        }
        result = db.events.insert_one(event)
        event['_id'] = result.inserted_id
        return serialize_doc(event)

    @staticmethod
    def find_by_user(user_email):
        """Get all events for a user"""
        db = get_db()
        events = list(db.events.find({'user_email': user_email}).sort('created_at', -1))
        return [serialize_doc(e) for e in events]

    @staticmethod
    def find_by_id(event_id):
        """Find event by ID"""
        db = get_db()
        try:
            event = db.events.find_one({'_id': ObjectId(event_id)})
            return serialize_doc(event) if event else None
        except:
            return None

    @staticmethod
    def delete(event_id):
        """Delete an event"""
        db = get_db()
        try:
            result = db.events.delete_one({'_id': ObjectId(event_id)})
            return result.deleted_count > 0
        except:
            return False

# QR Code operations
class QRCodeDB:
    @staticmethod
    def create(event_id, content):
        """Create a new QR code"""
        db = get_db()
        qr_code = {
            'event_id': event_id,
            'content': content,
            'scanned_at': datetime.utcnow().isoformat(),
            'processed': False,
            'category': None,
            'summary': None
        }
        result = db.qr_codes.insert_one(qr_code)
        qr_code['_id'] = result.inserted_id
        return serialize_doc(qr_code)

    @staticmethod
    def find_by_event(event_id):
        """Get all QR codes for an event"""
        db = get_db()
        qr_codes = list(db.qr_codes.find({'event_id': event_id}).sort('scanned_at', -1))
        return [serialize_doc(qr) for qr in qr_codes]

    @staticmethod
    def exists(event_id, content):
        """Check if QR code already exists in event"""
        db = get_db()
        return db.qr_codes.count_documents({'event_id': event_id, 'content': content}) > 0

    @staticmethod
    def update(qr_id, updates):
        """Update QR code"""
        db = get_db()
        try:
            db.qr_codes.update_one(
                {'_id': ObjectId(qr_id)},
                {'$set': updates}
            )
            return True
        except:
            return False

    @staticmethod
    def find_unprocessed(event_id):
        """Get unprocessed QR codes for an event"""
        db = get_db()
        qr_codes = list(db.qr_codes.find({
            'event_id': event_id,
            'processed': False
        }))
        return [serialize_doc(qr) for qr in qr_codes]

    @staticmethod
    def delete_by_event(event_id):
        """Delete all QR codes for an event"""
        db = get_db()
        result = db.qr_codes.delete_many({'event_id': event_id})
        return result.deleted_count
