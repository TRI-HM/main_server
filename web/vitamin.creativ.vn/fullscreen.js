// Tạo popup overlay
const overlay = document.createElement('div');
overlay.style.position = 'fixed';
overlay.style.top = '0';
overlay.style.left = '0';
overlay.style.width = '100vw';
overlay.style.height = '100vh';
overlay.style.background = 'rgba(0,0,0,0.5)';
overlay.style.display = 'flex';
overlay.style.alignItems = 'center';
overlay.style.justifyContent = 'center';
overlay.style.zIndex = '9999';

// Tạo popup box
const popup = document.createElement('div');
popup.style.background = '#fff';
popup.style.padding = '32px 24px';
popup.style.borderRadius = '8px';
popup.style.boxShadow = '0 2px 16px rgba(0,0,0,0.2)';
popup.style.textAlign = 'center';
popup.style.minWidth = '320px';

// Nội dung
const message = document.createElement('div');
message.textContent = 'Bạn có muốn hiển thị toàn bộ nội dung màn hình không?';
message.style.marginBottom = '24px';

// Nút
const btnAgree = document.createElement('button');
btnAgree.textContent = 'Đồng ý';
btnAgree.style.marginRight = '16px';
btnAgree.style.padding = '8px 20px';
btnAgree.style.cursor = 'pointer';

const btnCancel = document.createElement('button');
btnCancel.textContent = 'Không';
btnCancel.style.padding = '8px 20px';
btnCancel.style.cursor = 'pointer';

// Xử lý sự kiện
btnAgree.onclick = () => {
  // Yêu cầu fullscreen cho body
  const elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.webkitRequestFullscreen) { // Safari
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) { // IE11
    elem.msRequestFullscreen();
  }
  document.body.removeChild(overlay);
};

btnCancel.onclick = () => {
  document.body.removeChild(overlay);
};

// Không cho bấm ngoài popup
overlay.addEventListener('click', (e) => {
  if (e.target === overlay) {
    e.stopPropagation();
  }
});

// Lắp ghép các thành phần
popup.appendChild(message);
popup.appendChild(btnAgree);
popup.appendChild(btnCancel);
overlay.appendChild(popup);

// Thêm vào body
document.body.appendChild(overlay);