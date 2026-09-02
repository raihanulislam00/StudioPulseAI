import json
import logging
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from app.config import settings
from app.agents.director import DirectorAgent
from app.models.schemas import InvestigationRequest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("studiopulse.api")

app = FastAPI(
    title="StudioPulse AI — Agent Service",
    version="1.0.0",
    description="Autonomous Incident-Response Agent for Live Media & Entertainment Platforms",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {
        "service": "StudioPulse AI Agent Service",
        "status": "online",
        "mcp_mode": settings.grafana_mcp_mode,
        "model": settings.gemini_model,
        "track": "Google Agentic Cinema Hackathon (Grafana Track)",
    }


@app.get("/health")
def health_check():
    return {"status": "healthy"}


@app.post("/api/investigate/stream")
async def stream_investigation(req: InvestigationRequest):
    """
    Server-Sent Events endpoint streaming the multi-agent investigation lifecycle.
    """
    director = DirectorAgent(mode=req.mode)

    async def event_generator():
        async for event in director.run_investigation_stream(
            scenario=req.scenario,
            prompt=req.prompt or "",
        ):
            yield f"data: {json.dumps(event)}\n\n"

    return StreamingResponse(
        event_generator(),
        media_type="text/event-stream",
        headers={
            "Cache-Control": "no-cache",
            "Connection": "keep-alive",
            "X-Accel-Buffering": "no",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host=settings.agent_host, port=settings.agent_port)
