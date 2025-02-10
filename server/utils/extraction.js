const mammoth = require('mammoth');
const fs = require('fs');
const path = require('path');

async function extractTextFromDocx(filePath) {
    try {
        // Read the DOCX file
        const data = await fs.promises.readFile(filePath);
        
        // Extract text using Mammoth
        const { value } = await mammoth.extractRawText({ buffer: data });

        return value;  // Extracted text
    } catch (error) {
        console.error("Error extracting text:", error);
        return null;
    }
}

module.exports = { extractTextFromDocx };
