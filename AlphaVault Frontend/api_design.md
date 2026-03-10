# .NET Web API Design for Asset Vendor Compass

This document outlines the proposed RESTful API endpoints for the backend of the Asset Vendor Compass application.

## Authentication API

Handles user authentication and authorization.

- **`POST /api/auth/login`**
  - **Description:** Authenticates a user and returns a JWT token.
  - **Request Body:** `{ "email": "user@example.com", "password": "password123" }`
  - **Response:** `{ "token": "your_jwt_token", "user": { ... } }`

- **`POST /api/auth/register`**
  - **Description:** Registers a new user.
  - **Request Body:** `{ "username": "newuser", "email": "new@example.com", "password": "password123" }`
  - **Response:** `201 Created` with user object.

- **`POST /api/auth/logout`**
  - **Description:** Logs out the current user (e.g., invalidates token).
  - **Response:** `200 OK`

## Dashboard API

Provides data for the main dashboard.

- **`GET /api/dashboard/stats`**
  - **Description:** Retrieves summary statistics for the dashboard.
  - **Response:** `{ "totalAssets": 150, "totalVendors": 25, "pendingApprovals": 5 }`

- **`GET /api/dashboard/recent-activity`**
  - **Description:** Gets a list of recent activities.
  - **Response:** `[ { "activity": "New asset 'Laptop' added", "timestamp": "2023-10-27T10:00:00Z" }, ... ]`

## Assets API

Manages the assets in the system.

- **`GET /api/assets`**
  - **Description:** Get a paginated, sorted, and filtered list of all assets.
  - **Query Parameters:** `?page=1&pageSize=10&sortBy=name&sortOrder=asc&filter=laptop`
  - **Response:** A list of asset objects.

- **`GET /api/assets/{id}`**
  - **Description:** Get a single asset by its ID.
  - **Response:** An asset object.

- **`POST /api/assets`**
  - **Description:** Creates a new asset.
  - **Request Body:** Asset object data.
  - **Response:** `201 Created` with the new asset object.

- **`PUT /api/assets/{id}`**
  - **Description:** Updates an existing asset.
  - **Request Body:** Updated asset object data.
  - **Response:** `200 OK` with the updated asset object.

- **`DELETE /api/assets/{id}`**
  - **Description:** Deletes an asset.
  - **Response:** `204 No Content`.

## Vendors API

Manages vendors.

- **`GET /api/vendors`**
  - **Description:** Get a list of all vendors.
  - **Response:** A list of vendor objects.

- **`GET /api/vendors/{id}`**
  - **Description:** Get a single vendor by ID.
  - **Response:** A vendor object.

- **`POST /api/vendors`**
  - **Description:** Creates a new vendor.
  - **Request Body:** Vendor object data.
  - **Response:** `201 Created` with the new vendor object.

- **`PUT /api/vendors/{id}`**
  - **Description:** Updates an existing vendor.
  - **Request Body:** Updated vendor object data.
  - **Response:** `200 OK` with the updated vendor object.

- **`DELETE /api/vendors/{id}`**
  - **Description:** Deletes a vendor.
  - **Response:** `204 No Content`.

## Approvals API

Handles approval workflows.

- **`GET /api/approvals`**
  - **Description:** Get a list of all approval requests.
  - **Response:** A list of approval request objects.

- **`GET /api/approvals/{id}`**
  - **Description:** Get a single approval request by ID.
  - **Response:** An approval request object.

- **`POST /api/approvals/{id}/approve`**
  - **Description:** Approves a request.
  - **Response:** `200 OK`.

- **`POST /api/approvals/{id}/reject`**
  - **Description:** Rejects a request.
  - **Request Body:** `{ "reason": "Reason for rejection" }`
  - **Response:** `200 OK`.

## Users API

Manages users and their roles/permissions.

- **`GET /api/users`**
  - **Description:** Get a list of all users.
  - **Response:** A list of user objects.

- **`GET /api/users/{id}`**
  - **Description:** Get a single user by ID.
  - **Response:** A user object.

- **`POST /api/users`**
  - **Description:** Creates a new user.
  - **Request Body:** User object data.
  - **Response:** `201 Created` with the new user object.

- **`PUT /api/users/{id}`**
  - **Description:** Updates an existing user.
  - **Request Body:** Updated user object data.
  - **Response:** `200 OK` with the updated user object.

- **`DELETE /api/users/{id}`**
  - **Description:** Deletes a user.
  - **Response:** `204 No Content`.

## Settings API

Manages application-wide settings.

- **`GET /api/settings`**
  - **Description:** Get current application settings.
  - **Response:** A settings object.

- **`PUT /api/settings`**
  - **Description:** Update application settings.
  - **Request Body:** Settings object data.
  - **Response:** `200 OK` with the updated settings object.