 


export const Status = (res, statusCode, message, data = null) => {
    const response = {
        status: statusCode,
        message: message
    };
    if (data !== null) {
        response.data = data;
    }
    else {
            response.data = []; 
        
    
    }

    return res.status(statusCode).json(response);
                                   
     
}