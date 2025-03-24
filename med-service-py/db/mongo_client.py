from pymongo import MongoClient
import os

# MONGO_URI = os.getenv("MONGO_URI", "mongodb://mongo:27017")
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017")
MONGO_DB = os.getenv("MONGO_DB", "med-indications")

client = MongoClient(MONGO_URI)
db = client[MONGO_DB]

med_mappings = db["mappings"]

def insert_mapping(document: dict):
    """
    Inserts a new drug mapping document into MongoDB.
    """
    med_mappings.insert_one(document)
    print(f"✅ Inserted mapping for: {document.get('drug')}")