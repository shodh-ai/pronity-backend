export default interface UserDTO {
    id: string;
    firstName: string;
    lastName: string;
    occupation: string;
    major: string;
    nativeLanguage: string;
    flow: string;
    interests: string[];
    createdAt: Date;
}