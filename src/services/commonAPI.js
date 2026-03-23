import axios from "axios";


const commonAPI=async(httpmethod,url,reqbody,reqheader)=>{
    const reqconfig={
        method:httpmethod,
        url:url,
        data:reqbody,
        headers:reqheader?reqheader:{"content-type":"application/json"}
    }

   return await axios(reqconfig).then(res=>{
        return res
    }).catch(err=>{
        return err
    })
}
export default commonAPI