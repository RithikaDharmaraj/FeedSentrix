from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from pymongo import MongoClient
from transformers import pipeline
import spacy
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
import os
from datetime import datetime
from typing import List, Dict, Any, Optional
from bson import ObjectId


nlp = spacy.load("en_core_web_sm")

emotion_classifier = pipeline("text-classification", model="bhadresh-savani/distilbert-base-uncased-emotion", top_k=None)


sentiment_analyzer = SentimentIntensityAnalyzer()


mongo_uri = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
client = MongoClient(mongo_uri)
db = client["feedback"]
collection = db["feedback_analysis"]

app = FastAPI(title="Customer Emotion Analysis API")

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Allow frontend
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)



class FeedbackRequest(BaseModel):
    feedback: str
    source: Optional[str] = "web"
    customer_id: Optional[str] = None

class TimeRangeRequest(BaseModel):
    start_date: Optional[str] = None
    end_date: Optional[str] = None

def categorize_activation_level(score):
    if score > 0.7:
        return "High"
    elif score > 0.4:
        return "Medium"
    else:
        return "Low"

def detect_emotions(feedback):
    emotions_raw = emotion_classifier(feedback)[0]
    emotions = {e["label"]: e["score"] for e in emotions_raw}
    
   
    emotions_with_levels = {}
    for emotion, score in emotions.items():
        emotions_with_levels[emotion] = {
            "score": score,
            "activation_level": categorize_activation_level(score)
        }
    
    return emotions_with_levels

def extract_topics(text):
    doc = nlp(text)
    
    
    topics = [ent.text for ent in doc.ents]
    
    
    noun_phrases = [chunk.text for chunk in doc.noun_chunks]
    
    
    all_topics = list(set(topics + noun_phrases))
    
    
    categorized_topics = {}
    common_categories = {
        "delivery": ["delivery", "shipping", "shipment", "package"],
        "quality": ["quality", "condition", "durability"],
        "service": ["service", "customer service", "support", "staff"],
        "price": ["price", "cost", "expensive", "cheap", "affordable"],
        "product": ["product", "item", "goods"],
    }
    
    for topic in all_topics:
        topic_lower = topic.lower()
        assigned = False
        
        for category, keywords in common_categories.items():
            if any(keyword in topic_lower for keyword in keywords):
                if category not in categorized_topics:
                    categorized_topics[category] = []
                categorized_topics[category].append(topic)
                assigned = True
                break
        
        if not assigned:
            if "General" not in categorized_topics:
                categorized_topics["General"] = []
            categorized_topics["General"].append(topic)
    
    return categorized_topics if categorized_topics else {"General Feedback": ["General"]}

def calculate_adorescore(feedback):
    sentiment = sentiment_analyzer.polarity_scores(feedback)["compound"] * 100
    return round(sentiment, 2)

def analyze_feedback(feedback, source="web", customer_id=None):
    emotions = detect_emotions(feedback)
    topics = extract_topics(feedback)
    adorescore = calculate_adorescore(feedback)

    topic_scores = {category: calculate_adorescore(feedback) for category in topics}

    result = {
        "feedback": feedback,
        "source": source,
        "customer_id": customer_id,
        "emotions": emotions,
        "topics": topics,
        "adorescore": adorescore,
        "topic_scores": topic_scores,
        "timestamp": datetime.now()
    }

    inserted_doc = collection.insert_one(result)
    result["_id"] = str(inserted_doc.inserted_id)  # Convert ObjectId to string

    return result


@app.post("/analyze")
def analyze_feedback_api(request: FeedbackRequest):
    try:
        return analyze_feedback(
            request.feedback, 
            source=request.source, 
            customer_id=request.customer_id
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
def serialize_document(document):
    """Convert MongoDB document to JSON serializable format."""
    document["_id"] = str(document["_id"])  
    return document

@app.get("/feedback")
async def get_feedback(limit: int = 10, skip: int = 0):
    feedbacks = list(collection.find().skip(skip).limit(limit))
    return [serialize_document(feedback) for feedback in feedbacks]

@app.post("/analytics/summary")
def get_analytics_summary(time_range: TimeRangeRequest):
    """Get summary statistics for feedback"""
    query = {}
    
    if time_range.start_date and time_range.end_date:
        query["timestamp"] = {
            "$gte": datetime.fromisoformat(time_range.start_date),
            "$lte": datetime.fromisoformat(time_range.end_date)
        }
    
    
    cursor = collection.find(query)
    feedbacks = list(cursor)
    
    if not feedbacks:
        return {"error": "No feedback found for the given time range"}
    
    
    avg_score = sum(f["adorescore"] for f in feedbacks) / len(feedbacks)
    
    
    all_emotions = {}
    for f in feedbacks:
        for emotion, data in f["emotions"].items():
            if emotion not in all_emotions:
                all_emotions[emotion] = []
            all_emotions[emotion].append(data["score"])
    
    emotion_averages = {
        emotion: sum(scores) / len(scores) 
        for emotion, scores in all_emotions.items()
    }
    
    
    topic_counts = {}
    for f in feedbacks:
        for topic in f["topics"]:
            if topic not in topic_counts:
                topic_counts[topic] = 0
            topic_counts[topic] += 1
    
    return {
        "total_feedback": len(feedbacks),
        "average_adorescore": round(avg_score, 2),
        "emotion_distribution": emotion_averages,
        "top_topics": dict(sorted(topic_counts.items(), key=lambda x: x[1], reverse=True)[:5])
    }

@app.get("/health")
def health_check():
    """Health check endpoint"""
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)