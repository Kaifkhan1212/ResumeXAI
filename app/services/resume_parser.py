import io
import re
from typing import Optional
import PyPDF2
from docx import Document
from fastapi import HTTPException, status

class ResumeParserService:
    @staticmethod
    def clean_text(text: str) -> str:
        """
        Cleans extracted text by removing extra spaces, normalizing whitespace,
        and removing special characters.
        """
        # Normalize whitespace (replace multiple spaces/newlines with single space)
        text = re.sub(r'\s+', ' ', text)
        
        # Remove unusual special characters but keep common punctuation
        # This regex keeps alphanumeric characters and common symbols like @, ., +, #
        text = re.sub(r'[^\x00-\x7F]+', ' ', text) # Remove non-ASCII
        
        return text.strip()

    async def parse_pdf(self, file_content: bytes) -> str:
        try:
            pdf_reader = PyPDF2.PdfReader(io.BytesIO(file_content))
            text = ""
            for page in pdf_reader.pages:
                text += page.extract_text() or ""
            
            if not text.strip():
                raise ValueError("PDF file appears to be empty or contains no extractable text.")
                
            return self.clean_text(text)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to extract text from PDF: {str(e)}"
            )

    async def parse_docx(self, file_content: bytes) -> str:
        try:
            doc = Document(io.BytesIO(file_content))
            text = "\n".join([para.text for para in doc.paragraphs])
            
            if not text.strip():
                raise ValueError("DOCX file appears to be empty or contains no text.")
                
            return self.clean_text(text)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to extract text from DOCX: {str(e)}"
            )

    async def extract_text(self, file_content: bytes, filename: str) -> str:
        if not file_content:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="File is empty"
            )

        if filename.endswith(".pdf"):
            return await self.parse_pdf(file_content)
        elif filename.endswith(".docx"):
            return await self.parse_docx(file_content)
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Unsupported file type. Only PDF and DOCX are allowed."
            )

resume_parser_service = ResumeParserService()
