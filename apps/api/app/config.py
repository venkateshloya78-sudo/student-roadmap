from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import List


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    # Database
    database_url: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/studentroadmap"

    # JWT
    secret_key: str = "change-me-in-production-use-a-long-random-string"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 60 * 24  # 1 day
    refresh_token_expire_days: int = 30

    # CORS
    cors_origins: List[str] = ["http://localhost:5173", "http://localhost:3000"]

    # App
    app_name: str = "StudentRoadmap AI"
    debug: bool = False

    # AI Provider Settings
    ai_provider: str = "gemini"
    gemini_api_key: str | None = None
    openai_api_key: str | None = None
    default_ai_model: str = "gemini-2.0-flash"


settings = Settings()

