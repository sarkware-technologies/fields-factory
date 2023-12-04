import multer from "multer";
import { promisify } from "util";

export default class Utils {

    static handleError = (_e, _res) => {
        _res.status(500);
        _res.setHeader("content-type", "text/plain");
        _res.send(_e.message);
    };

    static response = (_totalRecords, _currentPage, _records) => {
        return {
            totalRecords: _totalRecords,
            totalPages: Math.ceil(_totalRecords / process.env.PAGE_SIZE),
            recordPerPage: process.env.PAGE_SIZE,
            currentPage: _currentPage,
            payload: _records,
        };
    };
    
}
