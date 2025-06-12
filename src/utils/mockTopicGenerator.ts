import TopicDTO from "../models/TopicDTO.js";
import UserDTO from "../models/userDTO.js";

export default function generateMockTopics(user: UserDTO, allTopics: TopicDTO[]) {
    return [{
        id: "1c82c8a5-18e9-40ed-ae67-13ff7f4d96dd",
        field: "Tech",
        topicName: "App Development",
        level: 0
    },
    {
        id: "e8a87089-1073-4c3c-a2a9-7eecab675481",
        field: "Tech",
        topicName: "Game Development",
        level: 0
    }]
}
