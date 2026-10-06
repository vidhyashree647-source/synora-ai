from flask import Flask, render_template, request, jsonify
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer

app = Flask(__name__)

analyzer = SentimentIntensityAnalyzer()


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/analyze", methods=["POST"])
def analyze():

    data = request.get_json()
    text = data.get("text", "").strip()

    if not text:
        return jsonify({
            "error": "Please enter some text."
        }), 400

    # Sentiment
    scores = analyzer.polarity_scores(text)
    compound = scores["compound"]

    if compound >= 0.05:
        sentiment = "Positive"
    elif compound <= -0.05:
        sentiment = "Negative"
    else:
        sentiment = "Neutral"

    # Word count
    words = text.split()
    word_count = len(words)

    # Character count
    character_count = len(text)

    # Sentence count
    sentences = [
        s for s in text.replace("!", ".")
        .replace("?", ".")
        .split(".")
        if s.strip()
    ]

    sentence_count = len(sentences)

    # Emotion
    lower_text = text.lower()

    if any(word in lower_text for word in [
        "happy", "joy", "excited", "love", "amazing",
        "good", "great", "wonderful"
    ]):
        emotion = "Joy"
        emotion_icon = "😊"

    elif any(word in lower_text for word in [
        "sad", "cry", "lonely", "unhappy"
    ]):
        emotion = "Sadness"
        emotion_icon = "😢"

    elif any(word in lower_text for word in [
        "angry", "hate", "mad", "furious"
    ]):
        emotion = "Anger"
        emotion_icon = "😡"

    elif any(word in lower_text for word in [
        "fear", "scared", "afraid", "worried"
    ]):
        emotion = "Fear"
        emotion_icon = "😨"

    else:
        emotion = "Calm"
        emotion_icon = "😌"

    # Confidence
    confidence = round(70 + abs(compound) * 25, 1)

    if confidence > 95:
        confidence = 95

    return jsonify({
        "sentiment": sentiment,
        "score": compound,
        "emotion": emotion,
        "emotion_icon": emotion_icon,
        "confidence": confidence,
        "words": word_count,
        "characters": character_count,
        "sentences": sentence_count
    })


if __name__ == "__main__":
    app.run(debug=True)