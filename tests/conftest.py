import os
import sys
from typing import AsyncGenerator
import pytest
from httpx import AsyncClient, ASGITransport

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

@pytest.fixture(scope="function")
async def client() -> AsyncGenerator[AsyncClient, None]:
    async with app.router.lifespan_context(app):
        async with AsyncClient(
            transport=ASGITransport(app=app),
            base_url="http://test"
        ) as ac:
            yield ac
