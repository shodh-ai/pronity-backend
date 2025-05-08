import { Components } from "../types/FlowPayload.js";

export default interface FlowDTO {
    last_studied: number;
    components: Components[];
}