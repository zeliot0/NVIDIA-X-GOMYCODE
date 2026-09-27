import os
from dotenv import load_dotenv

load_dotenv()


class Settings:
    APP_NAME: str = os.getenv("APP_NAME", "SAFEAI")
    APP_VERSION: str = os.getenv("APP_VERSION", "1.0.0")
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./safeai.db")


settings = Settings()
