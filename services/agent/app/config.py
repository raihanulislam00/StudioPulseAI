import os
try:
    from pydantic_settings import BaseSettings, SettingsConfigDict
except ImportError:
    from pydantic import BaseModel as BaseSettings
    SettingsConfigDict = None


class Settings(BaseSettings):
    # Google Cloud & Gemini
    google_cloud_project: str = os.getenv("GOOGLE_CLOUD_PROJECT", "")
    google_cloud_region: str = os.getenv("GOOGLE_CLOUD_REGION", "us-central1")
    gemini_api_key: str = os.getenv("GEMINI_API_KEY", "")
    gemini_model: str = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

    # Grafana Cloud & MCP
    grafana_url: str = os.getenv("GRAFANA_URL", "https://studiopulse.grafana.net")
    grafana_service_account_token: str = os.getenv("GRAFANA_SERVICE_ACCOUNT_TOKEN", "")
    grafana_mcp_mode: str = os.getenv("GRAFANA_MCP_MODE", "simulated")  # 'live' or 'simulated'

    # Networking
    agent_host: str = os.getenv("AGENT_HOST", "0.0.0.0")
    agent_port: int = int(os.getenv("AGENT_PORT", "8000"))


settings = Settings()
