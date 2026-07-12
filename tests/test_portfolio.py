import pytest
from fastapi import status

@pytest.mark.asyncio
async def test_serve_portfolio(client):
    response = await client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert "text/html" in response.headers["content-type"]
    assert "Charan Kumar Reddy" in response.text

@pytest.mark.asyncio
async def test_contact_form_success(client):
    payload = {
        "name": "Jane Doe",
        "email": "jane@example.com",
        "message": "Interested in hiring you for SDE Fintech role!"
    }
    response = await client.post("/api/v1/contact", json=payload)
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "success"
    assert "Charan Kumar Reddy will get back to you" in data["message"]

@pytest.mark.asyncio
async def test_contact_form_validation_error(client):
    # Missing name, invalid email, too short message
    payload = {
        "email": "invalid-email-format",
        "message": "Short"
    }
    response = await client.post("/api/v1/contact", json=payload)
    assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
