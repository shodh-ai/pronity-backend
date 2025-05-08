export default interface ReportDTO {
    id: string;
    type: string;
    userText: string;
    topicId: string;
    comments: CommentDTO[];
    userId: string;
}

export interface CommentDTO {
    id: string;
    startIndex: number;
    endIndex: number;
    wrongText: string;
    rightText: string;
    info: string;
}