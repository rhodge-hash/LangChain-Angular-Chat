# Data Model for Feature 004: User Authentication and Session Management

## Entities

### User
Represents an application user.

*   **Attributes**:
    *   `email`: String (unique, required)
    *   `password`: String (hashed and salted, required)
    *   `roles`: Array of Strings (e.g., 'user', 'admin', default 'user')

### Authentication Token
Represents the JWT issued upon successful login, used for authorization.

*   **Attributes**:
    *   `token`: String (JWT string)
    *   `refreshToken`: String (for silent refresh, if implemented)
    *   `expiresIn`: Number (timestamp or duration)