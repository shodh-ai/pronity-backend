/**
 * Interface for registration payload
 * Includes email, password and optional name field
 */
export default interface RegisterPayload {
    email: string;
    password: string;
    name?: string; // Name is optional
}
