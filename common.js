


const FolderNames=['PDF','WordDocument','Spreadsheet','PowerPoint','OneNote','Application','Compressed','Audio','Image','Video','Plain','Others'];
const mimePrefixName=['audio','image','video','text'];
const mimePrefixValue=['Audio','Image','Video','Plain'];
const mimeSuffixName=['octet-stream','vnd.google-apps.spreadsheet','vnd.google-apps.document','vnd.google-apps.presentation','pdf'];
const mimeSuffixValue=['Plain','Spreadsheet','WordDocument','PowerPoint','PDF'];
const extensionsName=['pdf','docx','doc','xlsx','xls','xlsm','xlsb','csv','pps','ppt','pptx','pptm','sldx','sldm','one','exe','zip','rar','gzip','gz','7z','zipx','epub','iso','tar','png','jpg','bmp','gif','jpeg','raw','ico','svg','tif','tiff','ps','psd','avi','mp4','mov','qt','mkv','avchd','flv','swf','wmv','mpeg','mpg','m4p','m4v','ogg','webm','3gp','txt','sql','java','cpp','R','js','jsx','rtf','class','py','php','vb','c','cs','h','sh','swift','cgi','pl','html','htm','cer','css','rss','xhtml','log','ods','aif','cda','mpa','wav','wma','wpl','bat','apk','jar','msi','wsf','mp3'];
const extensionValue=['PDF','WordDocument','WordDocument','Spreadsheet','Spreadsheet','Spreadsheet','Spreadsheet','Spreadsheet','PowerPoint','PowerPoint','PowerPoint','PowerPoint','PowerPoint','PowerPoint','OneNote','Application','Compressed','Compressed','Compressed','Compressed','Compressed','Compressed','Compressed','Compressed','Compressed','Image','Image','Image','Image','Image','Image','Image','Image','Image','Image','Image','Image','Video','Video','Video','Video','Video','Video','Video','Video','Video','Video','Video','Video','Video','Video','Video','Video','Plain','Plain','Plain','Plain','Plain','Plain','Plain','WordDocument','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Plain','Spreadsheet','Audio','Audio','Audio','Audio','Audio','Audio','Application','Application','Application','Application','Application','Audio'];


const mimePrefixMappings=new Object();
const mimeSuffixMappings=new Object();
const extensionMappings=new Object();

const createFolderMapping = async () =>{
  mimePrefixName.forEach((item,index)=>{
    mimePrefixMappings[item]=mimePrefixValue[index];
  });
  mimeSuffixName.forEach((item,index)=>{
    mimeSuffixMappings[item]=mimeSuffixValue[index];
  });
  extensionsName.forEach((item,index)=>{
    extensionMappings[item]=extensionValue[index];
  });
}

const folderTypeAssign = async (file) => {
  try{
  console.log("reached folder type assign");
  if(typeof file !== undefined){
    let mimePref=await ((file.mimeType).split("/")[0]).toLowerCase();
    let mimeSuffArr=await (file.mimeType).split("/");
    let mimeSuff=await (mimeSuffArr[mimeSuffArr.length-1]).toLowerCase();
    let extension=await (file.fullFileExtension).toLowerCase();
    if (typeof extension !=='undefined' && extension.includes("exe")) extension="exe";
    if(typeof extensionMappings[extension] !== 'undefined') return extensionMappings[extension];
    else if(typeof mimeSuffixMappings[mimeSuff] !== 'undefined')  return mimeSuffixMappings[mimeSuff];    
    else if(typeof mimePrefixMappings[mimePref] !== 'undefined') return mimePrefixMappings[mimePref];
    
    else return 'Others';
  }
  }
  catch(err)
  {
    console.log(err.message);
    return err.message;
  }
}

module.exports={createFolderMapping,folderTypeAssign,FolderNames};
