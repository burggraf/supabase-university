import { headers } from './headers.ts'
interface ReturnObject { 
    data?: any; 
    error?: any;
    status?: number;
 } 
 
export const RESPONSE = (obj: ReturnObject) => {
    if (!obj.data) obj.data = null;
    if (!obj.error) obj.error = null;
    return new Response(
        JSON.stringify(obj), {
        headers,
        status: obj.status || 200
      })    
}
