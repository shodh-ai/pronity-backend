export default interface ReportPayload {
    type: string;
    user_text: string;
    topicId: string;
    comments: Comment[];
}

interface Comment {
    start: number;
    end: number;
    rightText: string;
    info: string;
}