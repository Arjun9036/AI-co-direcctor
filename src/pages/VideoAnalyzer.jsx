import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  LinearProgress,
  TextField,
} from "@mui/material";
import ReactMarkdown from "react-markdown";

const VideoAnalyzer = () => {
  const [file, setFile] = useState(null);
  const [userEmotion, setUserEmotion] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState(null);

  const backendURL =
    "https://arjun9036-multimodal-emotion-backend.hf.space/predict";

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setResult(null);
    setError("");
  };

  const handleAnalyze = async () => {
    if (!file || !userEmotion.trim()) {
      setError("⚠️ Please upload a video AND enter your intended emotion.");
      return;
    }

    setError("");
    setResult(null);
    setLoading(true);

    const formData = new FormData();
    formData.append("video", file);
    formData.append("user_emotion", userEmotion);

    try {
      const response = await fetch(backendURL, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();
      setResult(data);
    } catch (err) {
      console.error("Error:", err);
      setError("❌ Failed to analyze video. Ensure your HuggingFace backend is public.");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Download Report
  const handleDownload = () => {
    if (!result) return;

    const report = `
🎬 Video Emotion Analysis
File: ${file?.name}

Intended Emotion: ${userEmotion}
Predicted Emotion: ${result.predicted_emotion}
Confidence: ${(result.confidence * 100).toFixed(2)}%
Match: ${result.match ? "✅ Yes" : "❌ No"}

Recommendations:
${
  typeof result.recommendations === "object"
    ? result.recommendations.full_recommendation
    : result.recommendations
}
`;

    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `Video_Emotion_Report.txt`;
    link.click();
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #000000, #1a1a1a)",
        color: "white",
        py: 10,
        px: { xs: 2, sm: 6 },
      }}
    >
      <Container maxWidth="md">
        {/* Title */}
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{
            mb: 6,
            color: "orange",
            textShadow: "0px 0px 12px rgba(255,140,0,0.5)",
          }}
        >
          🎥 Video Emotion Analyzer
        </Typography>

        {/* Upload Section */}
        <Paper
          elevation={6}
          sx={{
            p: { xs: 3, sm: 5 },
            borderRadius: 4,
            backgroundColor: "#111",
            border: "1px solid rgba(255,255,255,0.1)",
            backdropFilter: "blur(8px)",
            textAlign: "center",
          }}
        >
          <Typography variant="h6" sx={{ mb: 2, color: "#f5f5f5" }}>
            Upload your acting video for AI analysis
          </Typography>

          {/* Upload Button */}
          <Button
            variant="contained"
            component="label"
            sx={{
              mt: 2,
              backgroundColor: "orange",
              color: "white",
              fontWeight: "bold",
              px: 4,
              py: 1,
              borderRadius: "30px",
              "&:hover": { backgroundColor: "#cc5500" },
            }}
          >
            Choose Video
            <input
              hidden
              accept="video/*"
              type="file"
              onChange={handleFileChange}
            />
          </Button>

          {file && (
            <>
              <Typography sx={{ mt: 2, color: "gray" }}>
                Selected File: <b>{file.name}</b>
              </Typography>

              <video
                controls
                src={URL.createObjectURL(file)}
                style={{
                  width: "100%",
                  marginTop: 20,
                  borderRadius: 10,
                  border: "1px solid rgba(255,255,255,0.2)",
                }}
              />
            </>
          )}

          {/* Emotion Input */}
          <TextField
            fullWidth
            variant="outlined"
            label="Your Intended Emotion"
            placeholder="e.g., anger, joy, sadness"
            value={userEmotion}
            onChange={(e) => setUserEmotion(e.target.value)}
            sx={{
              mt: 4,
              backgroundColor: "white",
              borderRadius: 2,
              "& input": { color: "black" },
            }}
          />

          {/* Analyze Button */}
          <Button
            variant="contained"
            onClick={handleAnalyze}
            sx={{
              mt: 4,
              px: 6,
              py: 1.5,
              fontWeight: "bold",
              borderRadius: "30px",
              backgroundColor: "orange",
              "&:hover": { backgroundColor: "#cc5500" },
            }}
            disabled={loading}
          >
            {loading ? "Analyzing Video…" : "Analyze Emotion"}
          </Button>

          {/* Progress Bar */}
          {loading && (
            <Box sx={{ width: "100%", mt: 4 }}>
              <Typography sx={{ color: "gray", mb: 1 }}>
                Processing video... please wait
              </Typography>
              <LinearProgress color="warning" />
            </Box>
          )}

          {error && (
            <Typography sx={{ mt: 3, color: "red" }}>{error}</Typography>
          )}
        </Paper>

        {/* Output Section */}
        {result && (
          <Paper
            elevation={4}
            sx={{
              mt: 6,
              p: { xs: 3, sm: 5 },
              borderRadius: 3,
              backgroundColor: "#0f0f0f",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#f5f5f5",
            }}
          >
            <Typography
              variant="h6"
              fontWeight="bold"
              gutterBottom
              sx={{ color: "orange" }}
            >
              🎬 Emotion Analysis Report
            </Typography>

            <Typography>
              <b>Predicted Emotion:</b> {result.predicted_emotion}
            </Typography>
            <Typography>
              <b>Confidence:</b> {(result.confidence * 100).toFixed(2)}%
            </Typography>
            <Typography>
              <b>Match with Intended Emotion:</b>{" "}
              {result.match ? "✅ Yes" : "❌ No"}
            </Typography>

            {/* ✅ Clean Markdown Recommendations */}
            <Box
              sx={{
                mt: 4,
                p: 3,
                borderRadius: 2,
                backgroundColor: "#1a1a1a",
                border: "1px solid rgba(255,255,255,0.15)",
              }}
            >
              <Typography
                variant="h6"
                sx={{ color: "orange", mb: 2, fontWeight: "bold" }}
              >
                💡 Recommendations
              </Typography>

              <Box
                sx={{
                  color: "#ddd",
                  fontSize: "1rem",
                  lineHeight: 1.7,
                  "& h3": { color: "orange", marginTop: "16px" },
                  "& strong": { color: "#fff" },
                  "& ul": { paddingLeft: "20px", marginTop: "8px" },
                  "& li": { marginBottom: "6px" },
                }}
              >
                <ReactMarkdown>
                  {typeof result.recommendations === "object"
                    ? result.recommendations.full_recommendation
                    : result.recommendations}
                </ReactMarkdown>
              </Box>
            </Box>

            {/* Download Button */}
            <Button
              variant="contained"
              color="success"
              sx={{
                mt: 3,
                px: 5,
                borderRadius: "25px",
                fontWeight: "bold",
              }}
              onClick={handleDownload}
            >
              Download Report
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
};

export default VideoAnalyzer;