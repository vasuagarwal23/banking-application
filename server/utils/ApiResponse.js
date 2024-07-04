class ApiResponse {
    constructor(statusCode, data, message = "Success", meta = {}) {
        this.statusCode = statusCode;
        this.data = data;
        this.message = message;
        this.success = statusCode < 400;
        this.meta = meta;  
    }
}

export { ApiResponse };
