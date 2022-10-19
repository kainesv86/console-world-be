import { ResponseListDTO } from '../interface/response.interface';

export class ResponseList<T> implements ResponseListDTO<T> {
    data: T[];
    count: number;
    constructor(data: T[], count: number) {
        this.data = data;
        this.count = count;
    }
}
