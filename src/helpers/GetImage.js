
// get image
const getImage = async(url)=>{
    const response = await fetch(url);
    const blob = await response.blob();
    const uri = URL.createObjectURL(blob);
   return uri;
  }
  export default getImage;