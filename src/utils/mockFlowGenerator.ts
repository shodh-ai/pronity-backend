import UserDTO from "../models/userDTO.js";
import { Components } from "../types/FlowPayload.js";

export default function generateMockFlow(user: UserDTO) : Components[] {
    return [
        {
            type: 'speaking',
            level: 1
        },
        {
            type: 'writing',
            level: 1
        },
        {
            type: 'listening',
            level: 1
        },
        {
            type: 'speaking',
            level: 2
        }
    ]
}