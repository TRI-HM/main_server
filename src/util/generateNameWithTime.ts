export const generateFileNameWithTime = (): string => {
    // format : yyyymmddhhmmssSSS-randomNumber
    const randomNumber = Math.floor(Math.random() * 1E9);
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const hour = currentDate.getHours().toString().padStart(2, '0');
    const minute = currentDate.getMinutes().toString().padStart(2, '0');
    const second = currentDate.getSeconds().toString().padStart(2, '0');
    const millisecond = currentDate.getMilliseconds().toString().padStart(3, '0');

    return `${year}${month}${day}${hour}${minute}${second}${millisecond}-${randomNumber}`;
}


// Tạo tên folder theo format yyyymmdd (giống như trong multer)
export const getDateFolderName = (): string => {
    const currentDate = new Date();
    const year = currentDate.getFullYear().toString();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}
