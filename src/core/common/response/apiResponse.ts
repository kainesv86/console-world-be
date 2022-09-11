import { ResponseBody } from '../interface/api.interface';

class ApiResponse {
    public send<T>(data: T, error: any) {
        return { data: data, error: error } as ResponseBody<T>;
    }
}

export const apiResponse = new ApiResponse();
