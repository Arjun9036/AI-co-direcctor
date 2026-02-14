import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  MenuItem,
  FormControl,
  Select,
  InputLabel,
  CircularProgress,
} from "@mui/material";

import UploadFileIcon from "@mui/icons-material/UploadFile";
import DownloadIcon from "@mui/icons-material/Download";

// ✅ DOCX generator
import { Document, Packer, Paragraph } from "docx";
import { saveAs } from "file-saver";

export default function ScriptWriterApp() {
  const [genre, setGenre] = useState("Comedy");
  const [scriptText, setScriptText] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  const API_BASE = "https://Arjun9036-script-writer-api.hf.space";

  // ✅ Generate Real DOCX File
  const downloadAsDoc = async () => {
    const content =
      result?.structured_script ||
      result?.final_script ||
      "No output available.";

    const paragraphs = content.split("\n").map(
      (line) =>
        new Paragraph({
          text: line,
        })
    );

    const doc = new Document({
      sections: [
        {
          properties: {},
          children: paragraphs,
        },
      ],
    });

    const blob = await Packer.toBlob(doc);
    saveAs(blob, `Transformed_${genre}_Script.docx`);
  };

  // ✅ Submit Handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!file && !scriptText.trim()) {
      setErrorMessage("Please provide script text or upload a PDF.");
      return;
    }

    setLoading(true);
    setResult(null);

    try {
      let response;

      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("genre", genre);

        response = await fetch(`${API_BASE}/generate-script-from-pdf/`, {
          method: "POST",
          body: formData,
        });
      } else {
        response = await fetch(`${API_BASE}/generate-script/`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ original_script: scriptText, genre }),
        });
      }

      if (!response.ok) {
        let errText;
        try {
          const errJson = await response.json();
          errText = errJson.detail || JSON.stringify(errJson);
        } catch (err) {
          errText = await response.text();
        }
        throw new Error(`Server error: ${response.status} ${errText}`);
      }

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Request failed:", error);
      setErrorMessage(error.message || "Error: Could not process request.");
    } finally {
      setLoading(false);
    }
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
          variant="h3"
          align="center"
          fontWeight="bold"
          sx={{
            mb: 6,
            color: "orange",
            textShadow: "0px 0px 12px rgba(255,140,0,0.6)",
          }}
        >
          ✨ Script Writer AI
        </Typography>

        {/* Form Card */}
        <Paper
          elevation={10}
          sx={{
            p: 5,
            borderRadius: 4,
            backgroundColor: "#111",
            border: "1px solid rgba(255,255,255,0.15)",
            backdropFilter: "blur(12px)",
            boxShadow: "0px 0px 25px rgba(255,140,0,0.25)",
          }}
        >
          <form onSubmit={handleSubmit}>
            {/* Genre Select */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel sx={{ color: "gray" }}>Target Genre</InputLabel>
              <Select
                value={genre}
                label="Target Genre"
                onChange={(e) => setGenre(e.target.value)}
                sx={{
                  color: "white",
                  backgroundColor: "#222",
                  borderRadius: 2,
                  "& .MuiSvgIcon-root": { color: "white" },
                }}
              >
                {["Comedy", "Drama", "Thriller", "Romance", "Action"].map(
                  (g) => (
                    <MenuItem key={g} value={g}>
                      {g}
                    </MenuItem>
                  )
                )}
              </Select>
            </FormControl>

            {/* Text Area */}
            <Typography sx={{ mb: 1, color: "#ccc" }}>
              Paste Script Text
            </Typography>
            <TextField
              multiline
              rows={6}
              fullWidth
              value={scriptText}
              onChange={(e) => setScriptText(e.target.value)}
              placeholder="Paste your screenplay here..."
              sx={{
                mb: 3,
                backgroundColor: "white",
                borderRadius: 2,
                "& textarea": { color: "black" },
              }}
            />

            {/* Upload + Generate */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: 3,
              }}
            >
              {/* ✅ Upload + File Confirmation */}
              <Box>
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<UploadFileIcon />}
                  sx={{
                    backgroundColor: "#ff9800",
                    fontWeight: "bold",
                    px: 3,
                    py: 1.5,
                    borderRadius: "30px",
                    "&:hover": { backgroundColor: "#e07c00" },
                  }}
                >
                  Upload PDF
                  <input
                    hidden
                    type="file"
                    accept="application/pdf"
                    onChange={(e) =>
                      setFile(e.target.files?.[0] || null)
                    }
                  />
                </Button>

                {/* ✅ Show uploaded file */}
                {file && (
                  <Typography
                    sx={{
                      mt: 1,
                      ml: 1,
                      color: "#4caf50",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                    }}
                  >
                    ✅ Uploaded: {file.name}
                  </Typography>
                )}
              </Box>

              {/* Generate */}
              <Button
                type="submit"
                variant="contained"
                sx={{
                  backgroundColor: "orange",
                  fontWeight: "bold",
                  px: 4,
                  py: 1.5,
                  borderRadius: "30px",
                  "&:hover": { backgroundColor: "#cc5500" },
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: "white" }} />
                ) : (
                  "🚀 Generate Script"
                )}
              </Button>
            </Box>

            {/* Error */}
            {errorMessage && (
              <Typography
                sx={{
                  mt: 3,
                  color: "red",
                  backgroundColor: "#330000",
                  p: 2,
                  borderRadius: 2,
                }}
              >
                {errorMessage}
              </Typography>
            )}
          </form>
        </Paper>

        {/* Output Section */}
        {result && (
          <Paper
            elevation={8}
            sx={{
              mt: 6,
              p: 4,
              backgroundColor: "#0f0f0f",
              borderRadius: 3,
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            <Typography variant="h5" sx={{ color: "orange", mb: 2 }}>
              📜 Generated Script
            </Typography>

            <Typography
              component="pre"
              sx={{
                whiteSpace: "pre-wrap",
                color: "#ddd",
                fontFamily: "monospace",
                fontSize: "1rem",
                lineHeight: 1.6,
              }}
            >
              {result.structured_script ||
                result.final_script ||
                "No output found."}
            </Typography>

            {/* ✅ Download Button */}
            <Button
              variant="contained"
              startIcon={<DownloadIcon />}
              sx={{
                mt: 3,
                backgroundColor: "#28a745",
                px: 4,
                py: 1.5,
                borderRadius: "30px",
                fontWeight: "bold",
                "&:hover": { backgroundColor: "#1e7e34" },
              }}
              onClick={downloadAsDoc}
            >
              📥 Download as Word (.docx)
            </Button>
          </Paper>
        )}
      </Container>
    </Box>
  );
}