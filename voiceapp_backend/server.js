const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const axios = require("axios");
const connectDB = require('./db');
const autoAssignRoutes = require('./routes/autoAssignRoutes');

require("dotenv").config();

const PORT = process.env.PORT || objVariables.MongoPort || 5000;
const app = express();
app.use(express.json());
app.use(cors());
connectDB();

const { process_audio_file } = require("./backendNlpFiles/speech_to_text.js");
const objVariables = require("./common/variables");
const objMessages = require("./common/messages");

const shiftRoutes = require("./routes/getShifts");
app.use("/api/nurse", shiftRoutes);
const patientRoutes = require("./routes/patientRoutes");
app.use("/api/patient", patientRoutes);


app.use("/api/auth", require("./routes/authRoutes")); 
app.use("/api/patientRequests", require("./routes/patientRequests"));
app.use("/api/profile", require("./routes/profileRoutes")); 
app.use("/api", require("./routes/nurseRoutes")); 
app.use('/api/auto', autoAssignRoutes);


app.use((req, res, next) => {
    console.log(`📢 Incoming request: ${req.method} ${req.url}`);
    next();
});

const storage = multer.diskStorage({
    destination: "./uploads/",
    filename: (req, file, cb) => {
        cb(null, "voice_input.wav"); 
    },
});
const upload = multer({ storage });


app.post("/api/voice-request", upload.single("audio"), async (req, res) => {
    console.log("🎤 Received voice request...");
    if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioFilePath = path.join(__dirname, "uploads", "voice_input.wav");
    console.log("📁 Audio file path:", audioFilePath);

    try {
        const recognizedText = await process_audio_file(audioFilePath);

        const AudioRequest = mongoose.model("AudioRequest", new mongoose.Schema({
            audioFile: String,
            recognizedText: String,
        }));

        const audioRequest = new AudioRequest({
            audioFile: audioFilePath,
            recognizedText: recognizedText,
        });
        await audioRequest.save();

        res.json({ message: recognizedText });
    } catch (error) {
        console.error("❌ Error processing audio:", error);
        res.status(500).json({ error: "Error processing audio" });
    }
});

app.post("/api/voice-request/transcribe", upload.single("audio"), async (req, res) => {
    console.log("🎤 Received voice request for transcription...");
    if (!req.file) {
        return res.status(400).json({ error: "No audio file uploaded" });
    }

    const audioFilePath = path.join(__dirname, "uploads", "voice_input.wav");
    console.log("📁 Audio file path:", audioFilePath);

    try {
        const recognizedText = await process_audio_file(audioFilePath);
        res.json({ text: recognizedText });
    } catch (error) {
        console.error("❌ Error transcribing audio:", error);
        res.status(500).json({ error: "Error transcribing audio" });
    }
});

app.listen(PORT, () => console.log(objMessages.ServerIsRunningAndConnectedToDbHospital || `🚀 Server running on port ${PORT}`));