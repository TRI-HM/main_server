export const isName = (name: string): boolean => {
  if (!name) {
    return false;
  }
  if (name.length < 5 || name.length > 50) {
    return false;
  }
  if (!/^[a-zA-ZaáàảãạeéèẻẽẹiíìỉĩịoóòỏõọuúùủũụăắằẳẵặâấầẩẫậêếềểễệôốồổỗộơớờởỡợưứừửữựđAÁÀẢÃẠEÉÈẺẼẸIÍÌỈĨỊOÓÒỎÕỌUÚÙỦŨỤĂẮẰẲẴẶÂẤẦẨẪẬÊẾỀỂỄỆÔỐỒỔỖỘƠỚỜỞỠỢƯỨỪỬỮỰĐ ]+$/.test(name)) {
    return false;
  }
  return true;
}

export const isPhone = (phone: string): boolean => {
  if (!phone) {
    return false;
  }
  if (phone.length < 9 || phone.length > 11) {
    return false;
  }
  if (!/^0\d+$/.test(phone)) {
    return false;
  }
  return true;
}

export const isEmail = (email: string): boolean => {
  if (!email) {
    return false;
  }
  const emailParts = email.split('@');
  if (emailParts[0].length <= 5) {
    return false;
  }
  if (email.length < 15 || email.length > 100) {
    return false;
  }
  if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.]+\.[a-zA-Z]{2,}$/.test(email)) {
    return false;
  }
  return true;
}

export const handleChecker = (name: string, phone: string): boolean => {
  if (name === "" || phone === "") {
    alert("Vui lòng nhập đầy đủ thông tin");
    return false;
  }

  if (!isName(name)) {
    alert("Tên không hợp lệ. Tên phải từ 6 đến 50 ký tự");
    return false;
  }

  if (!isPhone(phone)) {
    alert(
      "Số điện thoại không hợp lệ. Phải đúng định dạng, số điện thoại phải từ 10 đến 11 số"
    );
    return false;
  }
  return true;
};