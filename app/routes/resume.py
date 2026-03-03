from fastapi import APIRouter, UploadFile, File, Depends, HTTPException, status
from pydantic import BaseModel
from ..services.resume_parser import resume_parser_service, ResumeParserService

router = APIRouter(tags=["Resume"])

class ResumeUploadResponse(BaseModel):
    filename: str
    content_length: int
    extracted_text: str

@router.post("/upload-resume", response_model=ResumeUploadResponse)
async def upload_resume(
    file: UploadFile = File(...),
    service: ResumeParserService = Depends(lambda: resume_parser_service)
):
    # Validate file extension
    allowed_extensions = {".pdf", ".docx"}
    file_ext = "." + file.filename.split(".")[-1].lower() if "." in file.filename else ""
    
    if file_ext not in allowed_extensions:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Unsupported file type. Only .pdf and .docx files are allowed."
        )

    # Read file content
    content = await file.read()
    
    if len(content) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    # Parse resume
    extracted_text = await service.extract_text(content, file.filename)

    return {
        "filename": file.filename,
        "content_length": len(content),
        "extracted_text": extracted_text
    }
