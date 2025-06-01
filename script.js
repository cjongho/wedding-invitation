// 모바일 청첩장 스크립트
document.addEventListener('DOMContentLoaded', () => {
    // 스크롤 애니메이션
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
                observer.unobserve(entry.target);
            }
        });
    }, {threshold: 0.1});

    // 모든 섹션을 관찰 대상으로 등록
    document.querySelectorAll('section').forEach(section => {
        observer.observe(section);
    });

    // 날짜 카운트다운
    const weddingDate = new Date('2025-08-15T14:00:00');
    const countdownElement = document.createElement('div');
    countdownElement.className = 'countdown';
    document.querySelector('.date-time').appendChild(countdownElement);

    function updateCountdown() {
        const now = new Date();
        const diff = weddingDate - now;

        if (diff > 0) {
            const days = Math.floor(diff / (100 *  *  * 4));
            countdownElement.textContent = `결혼식까지 ${days}일 남았습니다`;
        } else {
            countdownElement.textContent = '결혼을 축하해주세요!';
        }
    }

    updateCountdown();
    setInterval(updateCountdown, 86400000); // 24시간마다 업데이트

    // 갤러리 이미지 로드
    const photoGrid = document.querySelector('.photo-grid');
    const images = [
        'wedding1.jpg',
        'wedding2.jpg',
        'wedding3.jpg',
        'wedding4.jpg',
        'wedding5.jpg',
        'wedding6.jpg'
    ];

    images.forEach((image, index) => {
        if (index < 6) { // 모바일에서는 6개까지만 표시
            const img = document.createElement('img');
            img.src = `images/${image}`;
            img.alt = `신랑신부 사진 ${index + 1}`;
            img.loading = 'lazy'; // 이미지 지연 로딩
            img.addEventListener('click', () => openPhotoModal(index));
            photoGrid.appendChild(img);
        }
    });

    // 사진 모달
    function openPhotoModal(index) {
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.style.display = 'flex';

        const modalContent = document.createElement('div');
        modalContent.classList.add('modal-content');
        modalContent.style.backgroundColor = 'black';
        modalContent.style.padding = '0';

        const img = document.createElement('img');
        img.src = `images/${images[index]}`;
        img.style.width = '100%';
        img.style.height = 'auto';

        const closeButton = document.createElement('span');
        closeButton.innerText = '*';
        closeButton.classList.add('close-modal');
        closeButton.style.color = 'white';
        closeButton.addEventListener('click', () => {
            document.body.removeChild(modal);
        });

        modalContent.appendChild(closeButton);
        modalContent.appendChild(img);
        modal.appendChild(modalContent);
        document.body.appendChild(modal);

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                document.body.removeChild(modal);
            }
        });
    }

    // 계좌번호 모달
    const accountModal = document.getElementById('account-modal');
    const groomAccountBtn = document.getElementById('groom-account');
    const brideAccountBtn = document.getElementById('bride-account');
    const closeModal = document.querySelector('.close-modal');
    const modalBody = document.querySelector('.modal-body');

    // 계좌번호 정보
    const groomAccounts = {
        "신랑": ["신랑", "국민은행", "123-456-7890"],
        "신랑아버지": ["신랑 아버지", "신한은행", "456-789-0123"],
        "신랑어머니": ["신랑 어머니", "우리은행", "789-012-3456"]
    };

    const brideAccounts = {
        "신부": ["신부", "하나은행", "234-567-8901"],
        "신부아버지": ["신부 아버지", "기업은행", "567-890-1234"],
        "신부어머니": ["신부 어머니", "농협은행", "890-123-4567"]
    };

    // 계좌번호 복사 함수
    function copyAccountNumber(number) {
        navigator.clipboard.writeText(number)
            .then(() => {
                alert('계좌번호가 복사되었습니다.');
            })
            .catch(err => {
                // 클립보드 API 사용 불가 시 대체 방법
                const tempInput = document.createElement('input');
                tempInput.value = number;
                document.body.appendChild(tempInput);
                tempInput.select();
                document.execCommand('copy');
                document.body.removeChild(tempInput);
                alert('계좌번호가 복사되었습니다.');
            });
    }

    // 계좌 정보 모달 생성
    function createAccountModal(accounts) {
        modalBody.innerHTML = '';

        Object.values(accounts).forEach(info => {
            const bankInfoDiv = document.createElement('div');
            bankInfoDiv.className = 'bank-info';

            bankInfoDiv.innerHTML = `
                <div>
                    <p style="font-weight: 500; font-size: 18px;">${info[0]}</p>
                    <p>${info[1]} ${info[2]}</p>
                </div>
                <button class="bank-copy-btn" data-account="${info[2]}">
                    복사
                </button>
            `;

            modalBody.appendChild(bankInfoDiv);
        });

        // 복사 버튼 이벤트 리스너
        document.querySelectorAll('.bank-copy-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                copyAccountNumber(btn.dataset.account);
            });
        });
    }

    // 신랑측 계좌 버튼
    groomAccountBtn.addEventListener('click', () => {
        createAccountModal(groomAccounts);
        accountModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // 신부측 계좌 버튼
    brideAccountBtn.addEventListener('click', () => {
        createAccountModal(brideAccounts);
        accountModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    });

    // 모달 닫기 버튼
    closeModal.addEventListener('click', () => {
        accountModal.style.display = 'none';
        document.body.style.overflow = 'auto';
    });

    // 모달 외부 클릭시 닫기
    window.addEventListener('click', (e) => {
        if (e.target === accountModal) {
            accountModal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });

    // 링크 복사 버튼
    document.getElementById('copy-url').addEventListener('click', () => {
        const currentUrl = window.location.href;

        try {
            navigator.clipboard.writeText(currentUrl).then(() => {
                alert('청첩장 주소가 복사되었습니다.');
            });
        } catch (err) {
            // 클립보드 API 사용 불가 시 대체 방법
            const tempInput = document.createElement('input');
            tempInput.value = currentUrl;
            document.body.appendChild(tempInput);
            tempInput.select();
            document.execCommand('copy');
            document.body.removeChild(tempInput);
            alert('청첩장 주소가 복사되었습니다.');
        }
    });

    // 지도 API (임시 처리)
    const mapElement = document.getElementById('map');
    mapElement.innerHTML = '<div style="display:flex; justify-content:center; align-items:center; height:100%; color:var(--secondary-text-color);">지도 API 연동 필요</div>';

    // 네비게이션 링크 설정
    const venueName = encodeURIComponent('웨딩홀 이름');
    const venueAddress = encodeURIComponent('서울시 강남구 테헤란로 123');

    document.getElementById('navermap').href = `nmap://search?query=${venueName}`;
    document.getElementById('kakaomap').href = `kakaomap://search?q=${venueName}&p=37.506502,127.053265`;
    document.getElementById('tmap').href = `tmap://search?name=${venueName}`;
});