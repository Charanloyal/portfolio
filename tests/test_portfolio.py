import pytest
from fastapi import status

@pytest.mark.asyncio
async def test_serve_portfolio(client):
    response = await client.get("/")
    assert response.status_code == status.HTTP_200_OK
    assert "text/html" in response.headers["content-type"]
    assert "Charan Kumar Reddy" in response.text
    assert "LakeFlow" in response.text
    assert "FeatureHub" in response.text
    assert "DataGuard" in response.text
    assert "txn-pipeline" in response.text
    assert "RaftKV" in response.text
    assert "NeuralGateway" in response.text
    assert "AgentForge" in response.text
    assert "Agent Orchestration System" in response.text
    assert "OctoScale" in response.text

@pytest.mark.asyncio
async def test_get_projects_api(client):
    response = await client.get("/api/v1/projects")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["total"] == 13
    assert len(data["projects"]) == 13
    
    # Test filtered category
    filter_response = await client.get("/api/v1/projects?category=distributed-systems")
    assert filter_response.status_code == status.HTTP_200_OK
    filtered_data = filter_response.json()
    assert filtered_data["total"] >= 3

@pytest.mark.asyncio
async def test_system_status_api(client):
    response = await client.get("/api/v1/system-status")
    assert response.status_code == status.HTTP_200_OK
    data = response.json()
    assert data["status"] == "HEALTHY"
    assert data["developer"] == "Charan Kumar Reddy"
    assert data["total_projects"] == 13

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
    assert response.status_code in [status.HTTP_422_UNPROCESSABLE_ENTITY, 422]
